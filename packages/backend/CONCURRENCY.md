# Concurrency Management

This document explains the concurrency patterns used in this Node.js Express API boilerplate to ensure data consistency and prevent race conditions.

## 🎯 Concurrency Philosophy

We prioritize **database-level consistency** over application-level optimistic locking. Our approach relies on:

1. **Atomic SQL queries** for single operations
2. **Row-level locks** for multi-step operations
3. **Explicit transactions** for complex workflows
4. **Minimal lock scope** to reduce contention

## 🔧 Atomic Query Pattern

**When to use**: Single-row updates that need to be atomic.

**Example**: Incrementing a counter safely:
```typescript
// src/repositories/sampleRepository.ts
export async function updateSampleItemCounterAtomic(id: number, increment: number) {
  const result = await db
    .update(sampleItems)
    .set({
      counter: sql`${sampleItems.counter} + ${increment}`
    })
    .where(eq(sampleItems.id, id))
    .returning();
  
  if (result.length === 0) {
    throw new Error('Sample item not found');
  }
  
  return result[0];
}
```

**Why this works**:
- Database guarantees the operation is atomic
- No race conditions between read and write
- Single round-trip to database
- No application-level locking required

## 🔒 Row-Level Locking Pattern

**When to use**: Multi-step operations that need consistent data.

**Example**: Complex update with business logic:
```typescript
// src/services/sampleService.ts
export async function incrementSampleItemCounterWithLock(id: number, increment: number) {
  return withTransaction(async (tx) => {
    // Lock the row for this transaction
    const item = await tx
      .select()
      .from(sampleItems)
      .where(eq(sampleItems.id, id))
      .for('update')  // <-- Row-level lock
      .limit(1);

    if (item.length === 0) {
      throw new Error('Sample item not found');
    }

    // Business logic here with locked data
    const newCounter = item[0].counter + increment;
    
    // Safe update within same transaction
    const updated = await tx
      .update(sampleItems)
      .set({ counter: newCounter })
      .where(eq(sampleItems.id, id))
      .returning();

    return updated[0];
  });
}
```

**Key characteristics**:
- `SELECT ... FOR UPDATE` locks the row
- Lock is held until transaction commits/rolls back
- Other concurrent operations wait for lock release
- Minimal lock scope (only locked rows)

## 🔄 Transaction Helper Pattern

**When to use**: Any multi-step database operation.

**Example**: User registration with multiple tables:
```typescript
// src/db/transaction.ts
export async function withTransaction<T>(fn: (tx: Parameters<typeof db.transaction>[0]) => Promise<T>): Promise<T> {
  return db.transaction(fn);
}
```

**Usage example**:
```typescript
// In a service
return withTransaction(async (tx) => {
  // Step 1: Create user
  const user = await tx.insert(users).values(userData).returning();
  
  // Step 2: Create related record (atomic with user creation)
  const profile = await tx.insert(profiles).values({
    userId: user[0].id,
    // ... other fields
  }).returning();
  
  // Both steps succeed or both fail
  return { user: user[0], profile: profile[0] };
});
```

## 🎭 Lock Scope Minimization

**Principle**: Keep locks for the shortest time possible.

**Good example**:
```typescript
// Lock only what you need, for only as long as needed
export async function updateUserBalance(userId: number, amount: number) {
  return withTransaction(async (tx) => {
    // Lock only the user row
    const user = await tx
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .for('update')
      .limit(1);

    // Quick business logic
    const newBalance = user[0].balance + amount;
    
    // Immediate update
    return tx
      .update(users)
      .set({ balance: newBalance })
      .where(eq(users.id, userId))
      .returning();
  });
}
```

## ❌ What We Avoid

### Optimistic Locking
```typescript
// DON'T DO THIS
const item = await getItem(id);
const newCounter = item.counter + increment;
await updateItem(id, { counter: newCounter, version: item.version + 1 });
// Race condition possible between read and write
```

### Advisory Locks
```typescript
// DON'T DO THIS (complex and error-prone)
await tx.execute('SELECT pg_advisory_lock(12345)');
// Hard to manage and容易忘记释放
```

### Application-Level Locking
```typescript
// DON'T DO THIS (doesn't scale)
if (globalLocks[id]) {
  throw new Error('Operation in progress');
}
globalLocks[id] = true;
// Race conditions in distributed systems
```

## 📊 Concurrency Testing

**Test scenario**: Multiple concurrent increments
```typescript
// tests/concurrency.test.ts
test.concurrent('concurrent counter increments', async () => {
  const itemId = 1;
  const increments = 100;
  
  // Run 100 concurrent increments
  const promises = Array.from({ length: increments }, () => 
    incrementSampleItemCounterAtomic(itemId, 1)
  );
  
  await Promise.all(promises);
  
  // Final value should be exactly 100
  const result = await getSampleItem(itemId);
  expect(result.counter).toBe(100);
});
```

## 🏗️ Real-World Patterns

### 1. Account Balance Operations
```typescript
// Use atomic update for simple transfers
export async function transferBalance(fromId: number, toId: number, amount: number) {
  return withTransaction(async (tx) => {
    // Lock both accounts
    const [from, to] = await Promise.all([
      tx.select().from(accounts).where(eq(accounts.id, fromId)).for('update'),
      tx.select().from(accounts).where(eq(accounts.id, toId)).for('update')
    ]);
    
    if (from[0].balance < amount) {
      throw new Error('Insufficient funds');
    }
    
    // Atomic transfers
    await Promise.all([
      tx.update(accounts).set({ 
        balance: sql`${accounts.balance} - ${amount}` 
      }).where(eq(accounts.id, fromId)),
      
      tx.update(accounts).set({ 
        balance: sql`${accounts.balance} + ${amount}` 
      }).where(eq(accounts.id, toId))
    ]);
  });
}
```

### 2. Inventory Management
```typescript
// Atomic decrement prevents overselling
export async function decrementInventory(productId: number, quantity: number) {
  const result = await db
    .update(inventory)
    .set({
      quantity: sql`${inventory.quantity} - ${quantity}`
    })
    .where(
      and(
        eq(inventory.productId, productId),
        sql`${inventory.quantity} >= ${quantity}`  // Only update if enough stock
      )
    )
    .returning();
  
  if (result.length === 0) {
    throw new Error('Insufficient inventory');
  }
  
  return result[0];
}
```

## 🔍 Performance Considerations

1. **Lock contention**: Minimize lock time and scope
2. **Deadlock prevention**: Always acquire locks in same order
3. **Connection pooling**: Ensure adequate pool size
4. **Index optimization**: Lock only indexed rows
5. **Transaction size**: Keep transactions small

## 📋 Best Practices Checklist

- [ ] Use atomic queries for single-row updates
- [ ] Use `SELECT ... FOR UPDATE` for multi-step operations
- [ ] Always use `withTransaction()` for multiple database operations
- [ ] Keep lock scope minimal
- [ ] Acquire locks in consistent order to prevent deadlocks
- [ ] Test concurrent operations
- [ ] Monitor lock wait times in production
- [ ] Use appropriate indexes for locked queries

This concurrency model ensures data consistency while maintaining good performance and avoiding common pitfalls like race conditions, deadlocks, and inconsistent state.