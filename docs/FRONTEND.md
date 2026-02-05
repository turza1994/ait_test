# Frontend Development Guide

Next.js 16 frontend with modern React, TypeScript, and authentication integration.

## 🎨 Technology Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 3.4.19 + CSS variables
- **UI**: shadcn/ui + Radix UI
- **Forms**: React Hook Form + Zod validation
- **Auth**: JWT with automatic refresh + CSRF protection
- **Build**: npm, ESLint, PostCSS

## 📁 Project Structure

```
packages/frontend/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── layout.tsx         # Root layout with AuthProvider
│   │   ├── page.tsx          # Landing page
│   │   ├── login/             # Login page
│   │   └── dashboard/         # Protected dashboard
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   ├── auth/              # Authentication components
│   │   └── layout/            # Layout components
│   ├── contexts/              # React contexts
│   ├── hooks/                 # Custom hooks
│   ├── lib/                   # Utilities and configurations
│   └── types/                 # TypeScript type definitions
├── public/                    # Static assets
└── tailwind.config.ts         # Tailwind configuration
```

## 🔐 Authentication Integration

### JWT Token Management
- **Access Tokens**: 15min expiry, stored in localStorage + cookie
- **Refresh Tokens**: 7d expiry, HttpOnly cookies (server-managed)
- **CSRF Protection**: Required for refresh token requests
- **API Base URL**: `http://localhost:5000` (configured in `.env.local`)

### Using Auth Context
```typescript
import { useAuth } from '@/contexts/AuthContext';

export function ProtectedComponent() {
  const { user, login, logout, isLoading } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;
  
  // Component logic
}
```

### API Requests
Use centralized `apiClient` for automatic token handling:
```typescript
import { apiClient } from '@/lib/apiClient';

// Automatic token refresh on 401 responses
const result = await apiClient.get('/protected-endpoint');
```

## 🎨 UI Components

### shadcn/ui Integration
- Full shadcn/ui component library
- Consistent design system
- Dark mode support
- Mobile-responsive components

### Form Validation
- React Hook Form for form state
- Zod schemas for validation
- Real-time error feedback
- TypeScript integration

## 📜 Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 🛡️ Security Features

- CSRF protection for state-changing requests
- Automatic token refresh on expiration
- Secure token storage
- Input validation and sanitization
- XSS protection with Next.js defaults

## 🎯 Best Practices

### Component Development
1. Use `'use client'` for interactive components
2. Follow TypeScript strict mode
3. Implement proper error boundaries
4. Test accessibility and responsive design

### API Integration
1. Define types in `src/types/` first
2. Use centralized `apiClient` for HTTP requests
3. Handle loading and error states properly
4. Follow established response formats

### Styling
1. Use utility classes consistently
2. Component variants via `class-variance-authority`
3. Mobile-first responsive design
4. Dark mode support via CSS variables