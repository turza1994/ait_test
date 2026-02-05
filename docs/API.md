# Backend API Guide

Production-grade Node.js Express API with TypeScript and PostgreSQL.

## 🏗️ Architecture

```
packages/backend/
├── src/
│   ├── app.ts              # Express app configuration
│   ├── server.ts           # Server entry point
│   ├── routes/             # Route definitions
│   ├── controllers/        # HTTP request handlers
│   ├── services/           # Business logic
│   ├── repositories/       # Database access functions
│   ├── middlewares/        # Express middleware
│   ├── models/             # Drizzle ORM schemas
│   ├── schemas/            # Zod validation schemas
│   ├── utils/              # Utility functions
│   └── config/             # Environment configuration
├── drizzle/                 # Database migrations
└── tests/                  # Test files
```

## 🔐 Authentication System

### JWT Token Strategy
- **Access Token**: 15 minutes, sent in Authorization header
- **Refresh Token**: 7 days, stored in HttpOnly cookie
- **Password Hashing**: bcrypt with salt rounds

### Security Features
- Helmet.js for security headers
- CORS configuration for frontend
- Rate limiting for API protection
- Input validation with Zod schemas
- SQL injection prevention with Drizzle ORM

## 📜 API Endpoints

### Authentication
```typescript
POST /api/auth/signup     // User registration
POST /api/auth/login      // User login
POST /api/auth/refresh-token // Token refresh
```

### Sample Endpoints
```typescript
GET /api/health           // Health check
GET /api/sample/items/:id // Protected data (auth required)
PUT /api/sample/items/:id // Update item (auth required)
```

### Response Format
```typescript
// Success
{
  "success": true,
  "data": { ... }
}

// Error
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

## 🗄️ Database Operations

### Drizzle ORM Integration
- Type-safe database operations
- Automatic migrations with `drizzle-kit`
- Connection pooling and transactions

### Concurrency Patterns
```typescript
// Atomic update
await db.update(table)
  .set({ count: sql`${table.count} + 1` })
  .where(condition);

// Row-level locking
return withTransaction(async (tx) => {
  const item = await tx.select()
    .from(table)
    .where(condition)
    .for('update');
  
  return tx.update(table).set(updateData);
});
```

## 📋 Development Commands

```bash
# Development
npm run dev              # Start with hot reload
npm run build            # Build to dist/
npm run start            # Start production server

# Database
npm run migrate          # Run migrations
npm run migrate:generate # Create new migration
npm run studio           # Open Drizzle Studio

# Code Quality
npm run lint             # ESLint checks
npm run lint:fix         # Auto-fix issues
npm run test             # Run tests
npm run test:watch       # Watch mode
```

## 🛡️ Security Best Practices

### Input Validation
- All API endpoints use Zod schemas
- Validation middleware for route protection
- Type-safe request/response handling

### Error Handling
- Global error handler for consistent responses
- Structured logging with Pino
- No stack traces in production responses

### Rate Limiting
```typescript
// Configuration
RATE_LIMIT_WINDOW_MS=900000      // 15 minutes
RATE_LIMIT_MAX_REQUESTS=100       // Max requests per window
```

## 🧪 Testing Strategy

### Test Structure
```bash
tests/
├── unit/               # Pure function tests
├── integration/        # API endpoint tests
└── fixtures/          # Test data setup
```

### Test Examples
```typescript
// API integration test
import { test } from 'node:test';

test('POST /api/auth/login', async () => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'password123'
    })
  });
  
  const data = await response.json();
  assert(data.success === true);
});
```

## 🚀 Production Deployment

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# JWT Secrets
JWT_SECRET=your-super-secret-key
REFRESH_TOKEN_SECRET=your-refresh-secret

# Server
PORT=5000
NODE_ENV=production

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Database Migrations
```bash
# Generate migration
npm run migrate:generate

# Apply migrations
npm run migrate

# Inspect database
npm run studio
```

## 📊 Monitoring & Logging

### Structured Logging
```typescript
import { logger } from '../utils/logger.js';

logger.info('User authenticated', {
  userId: user.id,
  email: user.email,
  timestamp: new Date().toISOString()
});
```

### Health Checks
- `/api/health` endpoint for monitoring
- Database connectivity checks
- Application metrics exposure