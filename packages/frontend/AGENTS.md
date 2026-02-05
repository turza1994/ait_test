# AGENTS.md

This file contains essential guidelines for AI agents working on this Next.js 16 boilerplate project with JWT authentication integration. Follow these conventions to maintain code quality and consistency.

## Development Commands

### Core Commands
- `npm run dev` - Start development server (runs on port 3000, falls back to 3001)
- `npm run build` - Production build with TypeScript compilation
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks (fix with `npm run lint --fix`)

### Testing
- **No testing framework configured yet** - Set up before writing tests
- Recommended: `npm install -D vitest @testing-library/react @testing-library/jest-dom`
- When configured, use: `npm test [filename]` for single test file

## Project Structure & File Organization

### Path Aliases
Always use `@/` prefix for internal imports:
- `@/components/*` - React components
- `@/lib/*` - Utilities and configurations  
- `@/types/*` - TypeScript type definitions
- `@/hooks/*` - Custom React hooks
- `@/contexts/*` - React contexts

### File Naming Conventions
- **Components**: PascalCase (`LoginForm.tsx`, `Header.tsx`)
- **Utilities**: camelCase (`apiClient.ts`, `validation.ts`)
- **Types**: camelCase (`api.ts`, `auth.ts`)
- **Pages**: `page.tsx` (App Router convention)
- **Hooks**: prefixed with `use` (`useAuth.ts`)

## Code Style Guidelines

### Import Organization
```typescript
// 1. React/Next.js imports
import React from 'react';
import { NextPage } from 'next';

// 2. Third-party libraries
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// 3. Internal imports with @/ alias
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LoginRequest } from '@/types/api';
```

### TypeScript Rules
- **Strict mode enabled** - No `any` types allowed, use `unknown` instead
- Always type API responses with proper interfaces
- Use `interface` for object shapes, `type` for unions/primitives
- Prefer generics over `any` (`ApiResponse<T>`)

### Component Patterns
```typescript
'use client'; // Add for client components

import React from 'react';

export function ComponentName() {
  // 1. Hooks first
  const [state, setState] = React.useState();
  
  // 2. Event handlers
  const handleClick = () => {
    // handler logic
  };
  
  // 3. Effects last
  React.useEffect(() => {
    // effect logic
  }, []);
  
  return (
    // JSX with Tailwind classes
  );
}
```

### UI Component Pattern
Follow shadcn/ui conventions:
```typescript
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(/* variants */);

export interface ButtonProps extends 
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  // custom props
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
```

## Authentication Integration

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

## Error Handling

### API Error Pattern
```typescript
try {
  const result = await apiClient.post('/endpoint', data);
  // handle success
} catch (error) {
  const message = error instanceof Error ? error.message : 'Operation failed';
  // Show user feedback (toast, alert, etc.)
  setSubmitError(message);
} finally {
  setIsLoading(false);
}
```

### Form Validation
- Use React Hook Form + Zod schemas
- Display validation errors below inputs
- Handle submit errors with user-friendly messages

## Security Requirements

### CSRF Token Handling
```typescript
import { getCSRFToken, addCSRFToHeaders } from '@/lib/csrf';

// CSRF tokens automatically added to state-changing requests
// Tokens extracted from x-csrf-token response headers
```

### Response Format
Backend API uses nested structure:
```typescript
// Format: { success: boolean, data: T, message?: string }
const response = await apiClient.login(credentials);
const { user, accessToken } = response.data.data; // Note: nested data
```

## Styling Conventions

### Tailwind CSS
- Use utility classes consistently
- Component variants via `class-variance-authority`
- Responsive design with mobile-first approach
- Dark mode support via CSS variables

### CSS Variables
Define design tokens in `globals.css`:
```css
:root {
  --primary: 222.2 84% 4.9%;
  --primary-foreground: 210 40% 98%;
}
```

## State Management

### Global State
- Use React Context for authentication, theme
- Custom hooks for context access (`useAuth`, `useTheme`)

### Local State
- `useState` for simple UI state
- `useReducer` for complex local state
- Keep state close to where it's used

## Development Best Practices

### Before Committing
1. Run `npm run lint` - Fix all ESLint errors
2. Run `npm run build` - Ensure TypeScript compilation succeeds
3. Test functionality manually in dev server

### Component Development
1. Create components in appropriate directories
2. Add proper TypeScript interfaces for props
3. Include accessibility attributes (aria-*)
4. Test with keyboard navigation
5. Verify responsive behavior

### API Integration
1. Define types in `src/types/` first
2. Use centralized `apiClient` for HTTP requests
3. Handle loading and error states properly
4. CSRF tokens automatically handled for state-changing operations

## Environment Configuration

Required environment variables:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

## Quick Reference

### Creating New Components
```bash
# 1. Create component file
touch src/components/NewComponent.tsx

# 2. Add UI variant (if needed)
touch src/components/ui/new-ui-element.tsx

# 3. Add types (if needed)
touch src/types/new-feature.ts
```

### Common Imports
```typescript
// Utilities
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/apiClient';

// UI Components  
import { Button, Input, Card } from '@/components/ui';

// Hooks & Contexts
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
```

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 3.4.19 + CSS variables
- **UI**: shadcn/ui + Radix UI
- **Forms**: React Hook Form + Zod validation
- **Auth**: JWT with automatic refresh + CSRF protection
- **Build**: npm, ESLint, PostCSS

Follow these patterns to maintain consistency and leverage the full capabilities of this modern Next.js boilerplate with robust authentication.