# AGENTS.md

This guide is for agentic coding agents working in this Node.js Express API boilerplate.

## 🛠️ Development Commands

### Building & Running

```bash
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript to JavaScript
npm run start        # Run production server from dist/
```

### Testing

```bash
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
node --test tests/specific.test.ts  # Run single test file
node --test tests/specific.test.ts --grep "test name"  # Run specific test
tsx --test tests/specific.test.ts  # Alternative test runner
tsx --test --watch tests/  # Watch mode with tsx
```

### Code Quality

```bash
npm run lint          # Check ESLint rules
npm run lint:fix      # Auto-fix ESLint issues
npm run format        # Format with Prettier
npm run format:check  # Check formatting without changes
```

### Database

```bash
npm run migrate              # Apply pending migrations
npm run migrate:generate     # Generate new migration
npm run studio               # Open Drizzle Studio
```

## 📏 Code Style Guidelines

### Architecture Rules (MANDATORY)

- ❌ NO classes anywhere - only functions and small factory functions
- ❌ NO dependency injection containers or decorators
- ❌ NO Spring Boot patterns
- ✅ Layered architecture: Routes → Controllers → Services → Repositories
- ✅ Business logic MUST NOT depend on Express objects
- ✅ Controllers call services, services call repositories, repositories only talk to DB

### TypeScript & Types

- Strict mode enabled - no implicit any, all strict checks on
- Always use type inference: `z.infer<typeof schema>` for DTOs
- Prefer `unknown` + parsing over `any`
- Use exact types from Drizzle schemas, never duplicate
- No type assertions unless absolutely necessary
- Use nullish coalescing (`??`) and optional chaining (`?.`)

### Import Style

```typescript
// External libraries first
import express from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

// Internal modules (always use .js extensions)
import { logger } from '../utils/logger.js';
import { users } from '../models/index.js';
import { db } from '../db/client.js';
```

### Function Structure

```typescript
// Controller pattern
export const functionName = asyncHandler(
  async (req: Request, res: Response) => {
    const { field1, field2 }: InputType = req.body;
    const result = await serviceName(field1, field2);
    res.status(200).json({ success: true, data: result });
  }
);

// Service pattern
export async function serviceName(
  param1: string,
  param2: number
): Promise<ResultType> {
  const validation = validateInput(param1, param2);
  if (!validation.success) {
    throw new Error(validation.error);
  }
  return repositoryFunction(param1, param2);
}

// Repository pattern
export async function repositoryFunction(id: number): Promise<DatabaseResult> {
  return db.select().from(table).where(eq(table.id, id)).limit(1);
}
```

### File Naming & Organization

- Files: PascalCase for classes (not used), camelCase for everything else
- Functions: camelCase with descriptive names
- Constants: SCREAMING_SNAKE_CASE for config/exports
- Types: PascalCase for type names
- Use index.ts for clean exports in directories

### Error Handling

- Services throw errors, controllers don't swallow them
- Use descriptive error messages
- Global handler in middleware/errorHandler.ts handles all errors
- Don't expose stack traces to clients
- Log errors with structured logger
- Common error patterns: Invalid credentials (400), Email already exists (400), Resource not found (404), Internal server error (500)

### Database Operations

- **Always prefer atomic queries**: `UPDATE ... RETURNING`
- Use `withTransaction()` for multi-step operations
- Use row-level locks: `SELECT ... FOR UPDATE`
- Keep lock scope minimal
- No optimistic locking or advisory locks

### Validation

- All inputs validated with Zod schemas
- Use `validate()` middleware for route validation
- Infer types, don't duplicate: `type Input = z.infer<typeof schema>`
- Validate early, fail fast

### Authentication & Security

- JWT access tokens (15min) + HttpOnly refresh cookies
- Passwords hashed with bcrypt
- Use authMiddleware for protected routes
- Never log sensitive data
- Validate all inputs

### Code Quality Standards

- ESLint + Prettier configuration is mandatory
- No console.log in production (use logger)
- Prefer pure functions
- Keep functions small and focused
- Add comments only for architectural intent

### Testing Patterns

- Unit tests for pure functions/utils
- Integration tests for API endpoints
- Use node:test framework
- Test happy path and error cases
- Clean up test data in after hooks

### Concurrency Patterns

```typescript
// ✅ Atomic update
await db.update(table).set({ count: sql`${table.count} + 1` }).where(...);

// ✅ Row-level locking
return withTransaction(async (tx) => {
  const item = await tx.select().from(table).where(...).for('update');
  // business logic
  return tx.update(table).set(...);
});
```

### API Response Format

```typescript
// Success
{ success: true, data: {...} }

// Error
{ success: false, message: "Description", code?: "ERROR_CODE" }
```

### Environment Variables

- All config in src/config/index.ts with validation
- Use .env.example as template
- Never commit actual .env files
- Required variables must cause startup failure if missing

## 🚫 Absolute Prohibitions

- No classes, constructors, or `this`
- No dependency injection frameworks
- No `any` types
- No console.log (use logger)
- No mixing business logic with HTTP handling
- No database access in controllers
- No synchronous operations in services
- No unvalidated inputs
- No exposed secrets or stack traces

## ✨ Best Practices

- Always prefer existing patterns over new ones
- Check similar files before implementing new features
- Use established utility functions
- Follow the established error handling patterns
- Keep the layering clean at all costs
- Test concurrency scenarios for database operations
- Use structured logging with meaningful context

Remember: This is a functional, layered architecture. Maintain clean separation between layers and never leak framework concerns into business logic.

## ✨ Best Practices

- Always prefer existing patterns over new ones
- Check similar files before implementing new features
- Use established utility functions
- Follow the established error handling patterns
- Keep the layering clean at all costs
- Test concurrency scenarios for database operations
- Use structured logging with meaningful context

Remember: This is a functional, layered architecture. Maintain clean separation between layers and never leak framework concerns into business logic.
