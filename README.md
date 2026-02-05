# Boilerplate Fullstack

Production-ready fullstack monorepo with Next.js 16 frontend and Express.js backend.

## 🚀 Architecture

- **Frontend**: Next.js 16 with TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js Express with TypeScript, Drizzle ORM, PostgreSQL
- **Authentication**: JWT with access/refresh tokens
- **Database**: PostgreSQL with type-safe migrations
- **Package Manager**: npm workspaces

## 📁 Structure

```
boilerplate_fullstack/
├── packages/
│   ├── frontend/          # Next.js application (port 3000)
│   └── backend/           # Express API (port 5000)
├── scripts/               # Development and build scripts
├── docs/                  # Documentation
└── package.json           # Root workspace configuration
```

## 🛠️ Quick Start

### Prerequisites
- Node.js >= 22.0.0
- PostgreSQL >= 14
- npm

### 1. Clone and Install
```bash
git clone <repository-url>
cd boilerplate_fullstack
npm run install:all
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your database credentials and secrets
```

### 3. Database Setup
```bash
# Create PostgreSQL database
createdb app_db

# Run migrations
npm run migrate
```

### 4. Start Development
```bash
npm run dev
```

**Development URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

## 📜 Available Scripts

```bash
# Development
npm run dev              # Start both servers in parallel
npm run start:frontend   # Start frontend only
npm run start:backend    # Start backend only

# Building
npm run build            # Build both packages
npm run start             # Start production servers

# Database
npm run migrate          # Run database migrations
npm run migrate:generate # Generate new migration
npm run studio           # Open Drizzle Studio

# Code Quality
npm run lint             # Lint all packages
npm run test             # Run all tests
npm run clean            # Clean all builds and node_modules

# Workspace Management
npm run install:all      # Install dependencies for all packages
```

## 🔐 Authentication Flow

1. **Login**: Frontend sends credentials to `/api/auth/login`
2. **Tokens**: Backend returns access token (15min) + refresh cookie (7d)
3. **API Calls**: Frontend includes access token in Authorization header
4. **Refresh**: Automatic token refresh on 401 responses
5. **Logout**: Clear tokens and redirect

## 🌐 API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh access token

### Example Endpoints
- `GET /api/health` - Health check
- `GET /api/sample/items/:id` - Protected data endpoint

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run specific package tests
npm run test --workspace=packages/backend
npm run test --workspace=packages/frontend
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Variables
Configure the following for production:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secure random secret
- `REFRESH_TOKEN_SECRET` - Secure random secret
- `NEXT_PUBLIC_API_BASE_URL` - Production API URL

## 📚 Package Documentation

- [Frontend Guide](./docs/FRONTEND.md) - Next.js development patterns
- [Backend Guide](./docs/API.md) - Express.js API patterns
- [Deployment Guide](./docs/DEPLOYMENT.md) - Production deployment

## 🎯 Perfect For

- ✅ Production applications
- ✅ Learning fullstack development
- ✅ Exams and interviews
- ✅ API development
- ✅ Modern web applications

## 📄 License

MIT License - see LICENSE file for details.