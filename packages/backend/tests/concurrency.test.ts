import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import { db } from '../src/db/client.js';
import { withTransaction } from '../src/db/transaction.js';
import { sampleItems } from '../src/models/index.js';
import { eq } from 'drizzle-orm';
import {
  findSampleItemById,
  updateSampleItemCounterAtomic,
} from '../src/repositories/sampleRepository.js';
import { incrementSampleItemCounterWithLock } from '../src/services/sampleService.js';

describe('Concurrency Tests', () => {
  let testItemId: number;

  before(async () => {
    // Create a test item
    const result = await db
      .insert(sampleItems)
      .values({ counter: 0 })
      .returning();

    testItemId = result[0].id;
  });

  after(async () => {
    // Clean up test item
    await db.delete(sampleItems).where(eq(sampleItems.id, testItemId));
  });

  test('concurrent atomic increments should be consistent', async () => {
    const increments = 10;

    // Create 10 concurrent increment operations
    const promises = Array.from({ length: increments }, (_, i) =>
      updateSampleItemCounterAtomic(testItemId, 1)
    );

    await Promise.all(promises);

    // Check final result
    const finalItem = await findSampleItemById(testItemId);
    assert.strictEqual(finalItem.counter, increments);
  });

  test('concurrent locked increments should be consistent', async () => {
    // Reset counter
    await db
      .update(sampleItems)
      .set({ counter: 0 })
      .where(eq(sampleItems.id, testItemId));

    const increments = 10;

    // Create 10 concurrent increment operations using row locks
    const promises = Array.from({ length: increments }, (_, i) =>
      incrementSampleItemCounterWithLock(testItemId, 1)
    );

    await Promise.all(promises);

    // Check final result
    const finalItem = await findSampleItemById(testItemId);
    assert.strictEqual(finalItem.counter, increments);
  });
});
