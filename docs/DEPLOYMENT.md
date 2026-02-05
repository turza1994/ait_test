# Deployment Guide

Comprehensive guide for deploying the fullstack monorepo to production environments.

## 🏗️ Deployment Architecture

### Production Architecture Options

#### Option A: Separate Deployments (Recommended)
```
Frontend → Vercel/Netlify (Static/SSR)
Backend → Railway/DigitalOcean/Heroku (Node.js)
Database → Supabase/PlanetScale/PostgreSQL Cloud
```

#### Option B: Single Server Deployment
```
Docker Container → Railway/DigitalOcean/AWS
├── Nginx Proxy (port 80/443)
├── Next.js Frontend (port 3000)
├── Express Backend (port 5000)
└── PostgreSQL Database
```

#### Option C: Serverless Deployment
```
Frontend → Vercel (Next.js)
Backend → Vercel Serverless Functions
Database → Supabase/PlanetScale
```

## 🚀 Frontend Deployment (Next.js)

### Vercel Deployment (Recommended)
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Link project
cd packages/frontend
vercel --prod

# 3. Configure environment variables
vercel env add NEXT_PUBLIC_API_BASE_URL production
```

#### Environment Variables for Frontend
```bash
NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.com
NODE_ENV=production
```

#### Vercel Configuration (vercel.json)
```json
{
  "buildCommand": "cd ../.. && npm run build",
  "outputDirectory": "packages/frontend/.next",
  "installCommand": "cd ../.. && npm run install:all",
  "framework": "nextjs"
}
```

### Netlify Deployment
```bash
# 1. Build project
npm run build

# 2. Deploy
cd packages/frontend
netlify deploy --prod --dir=.next
```

#### Netlify Configuration
```toml
[build]
  command = "cd ../.. && npm run build"
  publish = "packages/frontend/.next"

[build.environment]
  NODE_VERSION = "22"
  NEXT_PUBLIC_API_BASE_URL = "https://your-backend-domain.com"
```

## 🗄️ Backend Deployment (Express.js)

### Railway Deployment
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login and setup
railway login
railway init

# 3. Add PostgreSQL database
railway add postgresql

# 4. Configure environment variables
railway variables set PORT=3000
railway variables set NODE_ENV=production
```

#### Railway Configuration
```dockerfile
# Dockerfile in packages/backend/
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY ../../package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Copy frontend package reference
COPY ../../packages ./packages

# Build and start
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### DigitalOcean App Platform
```yaml
# .do/app.yaml in packages/backend/
name: fullstack-backend
services:
- name: api
  source_dir: /
  github:
    repo: your-username/boilerplate_fullstack
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  env:
  - key: PORT
    value: 3000
  - key: NODE_ENV
    value: production
```

### Docker Deployment
```dockerfile
# Dockerfile
FROM node:22-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package*.json ./
COPY packages/*/package*.json ./packages/*/
RUN npm ci

# Build backend
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/packages/backend/dist ./dist
COPY --from=builder /app/packages/backend/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 5000
CMD ["node", "dist/server.js"]
```

## 🗃️ Database Deployment

### Supabase (Recommended)
```bash
# 1. Create Supabase project
# 2. Get connection string
# 3. Update environment variables

DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

### Railway PostgreSQL
```bash
# Railway automatically provides DATABASE_URL
# Add as environment variable:
railway variables set DATABASE_URL=$DATABASE_URL
```

### PlanetScale
```bash
# 1. Create PlanetScale database
# 2. Get connection string
# 3. Configure environment variables

DATABASE_URL=mysql://[username]:[password]@gateway.planetscale.com/dbname
```

## 🔧 Environment Configuration

### Production Environment Variables
Create `.env.production` in root:
```bash
# Backend Configuration
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=your-super-secure-jwt-secret-256-bits
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your-super-secure-refresh-secret-256-bits
REFRESH_TOKEN_COOKIE_NAME=refresh_token
REFRESH_TOKEN_EXPIRES_IN=7d
PORT=5000
NODE_ENV=production

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGINS=https://your-frontend-domain.com

# Frontend Configuration
NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.com
```

### Security Best Practices
```bash
# Generate secure secrets (256-bit minimum)
openssl rand -base64 32

# Update secrets regularly
# Never commit secrets to git
# Use environment-specific configurations
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy Fullstack

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
      - run: npm run install:all
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-token: ${{ secrets.VERCEL_TOKEN }}

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        uses: railway-app/railway-action@v1
        with:
          api-token: ${{ secrets.RAILWAY_TOKEN }}
          service-id: ${{ secrets.RAILWAY_SERVICE_ID }}
```

## 🚀 Docker Compose (Local Testing)

### Docker Compose Configuration
```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: app_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build:
      context: .
      dockerfile: packages/backend/Dockerfile
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/app_db
      - NODE_ENV=production
    depends_on:
      - postgres

  frontend:
    build:
      context: .
      dockerfile: packages/frontend/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
    depends_on:
      - backend

volumes:
  postgres_data:
```

### Docker Compose Commands
```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Clean up volumes
docker-compose down -v
```

## 📊 Monitoring & Logging

### Application Monitoring
```bash
# Frontend Analytics (Vercel)
- Built-in Vercel Analytics
- Custom error tracking with Sentry
- Performance monitoring

# Backend Monitoring
- Railway logs dashboard
- Custom logging with Pino
- Error tracking with Sentry
```

### Health Checks
```typescript
// Backend health check
app.get('/api/health', async (req, res) => {
  try {
    await db.select().from(users).limit(1);
    res.json({ 
      success: true, 
      status: 'healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({ 
      success: false, 
      status: 'unhealthy',
      error: error.message 
    });
  }
});
```

## 🔒 SSL & Security

### SSL Configuration
```bash
# Frontend (Vercel/Netlify)
- Automatic SSL certificates
- HTTPS redirects enabled
- HSTS headers

# Backend (Nginx Proxy)
server {
    listen 443 ssl;
    server_name your-backend-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Security Headers
```typescript
// Backend security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

## 🚦 Performance Optimization

### Frontend Optimization
```bash
# Next.js optimizations
npm run build    # Automatic code splitting
npm run start    # Static optimization

# Bundle analysis
npx @next/bundle-analyzer
```

### Backend Optimization
```typescript
// Performance middleware
app.use(compression());  // Compress responses
app.use(cors({          // Configure CORS efficiently
  origin: process.env.CORS_ORIGINS?.split(','),
  credentials: true
}));

// Connection pooling
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,           // Max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

## 🔄 Database Migration in Production

### Safe Migration Process
```bash
# 1. Backup database
pg_dump $DATABASE_URL > backup.sql

# 2. Test migrations locally
npm run migrate

# 3. Deploy with zero downtime
# - Route traffic to new version
# - Run migrations
# - Switch traffic completely
# - Monitor for errors

# 4. Rollback plan
npm run migrate:rollback  # If migrations fail
```

### Migration Scripts
```typescript
// packages/backend/drizzle/rollback.ts
export async function rollback() {
  const migrations = await db.query.migrations.findMany();
  // Implement rollback logic
  console.log('Migration completed');
}
```

## 📋 Deployment Checklist

### Pre-Deployment Checklist
- [ ] All tests passing: `npm run test`
- [ ] Build successful: `npm run build`
- [ ] Linting clean: `npm run lint`
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] SSL certificates obtained
- [ ] Domain names configured
- [ ] Monitoring setup

### Post-Deployment Checklist
- [ ] Frontend accessible at domain
- [ ] Backend API responding correctly
- [ ] Authentication flow working
- [ ] Database queries executing
- [ ] Error logs monitored
- [ ] Performance metrics collected
- [ ] SSL certificates active
- [ ] Health checks passing

## 🔧 Troubleshooting

### Common Issues & Solutions

#### Frontend Issues
```bash
# Build failures
npm run clean && npm run install:all && npm run build

# API connection errors
- Verify NEXT_PUBLIC_API_BASE_URL
- Check CORS configuration
- Verify backend deployment

# Deployment failures
- Check Vercel build logs
- Verify environment variables
- Confirm domain configuration
```

#### Backend Issues
```bash
# Database connection errors
- Verify DATABASE_URL format
- Check database credentials
- Confirm network accessibility

# Authentication failures
- Verify JWT secrets match
- Check token expiration
- Verify CORS configuration

# Performance issues
- Check database query performance
- Monitor memory usage
- Review rate limiting configuration
```

## 📚 Additional Resources

### Documentation Links
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Railway Deployment Guide](https://docs.railway.app)
- [Docker Deployment Best Practices](https://docs.docker.com)
- [Next.js Production Guide](https://nextjs.org/docs/production)
- [Express.js Production Guide](https://expressjs.com/en/advanced/production)

### Monitoring Tools
- [Sentry](https://sentry.io) - Error tracking
- [LogRocket](https://logrocket.com) - Session replay
- [Uptime Robot](https://uptimerobot.com) - Uptime monitoring
- [Datadog](https://datadoghq.com) - Performance monitoring

This deployment guide covers all major deployment scenarios for the fullstack monorepo. Choose the deployment option that best fits your requirements and budget.