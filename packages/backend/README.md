# Node.js Express API Boilerplate

Production-grade Node.js backend with TypeScript, Express.js, Drizzle ORM, and PostgreSQL.

## 🚀 Features

- **Type Safety**: Full TypeScript with strict mode and Zod validation
- **Layered Architecture**: Routes → Controllers → Services → Repositories
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT access tokens + HttpOnly refresh cookies
- **Security**: Helmet, CORS, rate limiting
- **Concurrency**: Atomic queries and row-level locking
- **Testing**: Built-in test framework
- **Developer Experience**: ESLint, Prettier, hot reload

## 📋 Requirements

- Node.js >= 22
- PostgreSQL >= 14
- npm or yarn

## 🛠️ Setup

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd node-express-api
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and JWT secrets
   ```

3. **Set up database**
   ```bash
   # Create PostgreSQL database
   createdb app_db
   
   # Run migrations
   npm run migrate
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start server with hot reload
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run migrate              # Run pending migrations
npm run migrate:generate     # Generate new migration
npm run studio               # Open Drizzle Studio

# Testing
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode

# Code quality
npm run lint          # Run ESLint
npm run lint:fix      # Fix ESLint issues
npm run format        # Format code with Prettier
npm run format:check  # Check code formatting
```

## 🏗️ Architecture

```
src/
├── app.ts              # Express app configuration
├── server.ts           # Server entry point
├── routes.ts           # Route registration
├── config/             # Environment configuration
├── db/                 # Database client & transactions
├── models/             # Drizzle schemas
├── schemas/            # Zod validation schemas
├── repositories/       # Database access functions
├── services/           # Business logic
├── controllers/        # HTTP handlers
├── middlewares/        # Express middleware
└── utils/              # Utility functions
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh access token

### Sample API (Protected)
- `GET /api/sample/items/:id` - Get sample item
- `PUT /api/sample/items/:id` - Update item (atomic)
- `PUT /api/sample/items/:id/lock` - Update item (row lock)

### Health
- `GET /api/health` - API health check

## 🔒 Authentication

- **Access Token**: 15 minutes, sent in Authorization header
- **Refresh Token**: 7 days, stored in HttpOnly cookie
- **Password Hashing**: bcrypt with salt rounds

## 🧪 Testing

Run the test suite:
```bash
npm test
```

The boilerplate includes:
- Unit tests for business logic
- Integration tests for API endpoints
- Example test covering signup → login → refresh flow

## 📄 Concurrency

This project demonstrates safe concurrency patterns:

1. **Atomic Updates**: Single-query operations with `UPDATE ... RETURNING`
2. **Row-Level Locking**: `SELECT ... FOR UPDATE` with transactions
3. **Transaction Helper**: `withTransaction()` for multi-step operations

See [CONCURRENCY.md](./CONCURRENCY.md) for detailed examples.

## 🛡️ Security Features

- **Helmet**: Security headers
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: Configurable request limits
- **Input Validation**: Zod schemas for all inputs
- **Password Security**: bcrypt hashing
- **JWT Security**: Separate access/refresh tokens

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**

3. **Run database migrations**
   ```bash
   npm run migrate
   ```

4. **Start the server**
   ```bash
   npm run start
   ```

## 📝 License

MIT License - see LICENSE file for details.