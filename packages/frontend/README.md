# Next.js Frontend Boilerplate

Production-ready Next.js 15 frontend with JWT authentication integration for Express.js backend.

## 🚀 Features

- ✅ **Next.js 15** with App Router
- ✅ **TypeScript** strict mode
- ✅ **JWT Authentication** with automatic token refresh
- ✅ **React Hook Form** + **Zod** validation
- ✅ **Tailwind CSS** for styling
- ✅ **Protected Routes** with middleware
- ✅ **API Client** with error handling
- ✅ **Type-safe** API integration
- ✅ **Exam-ready** clean code structure

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with AuthProvider
│   │   ├── page.tsx           # Landing page
│   │   ├── login/
│   │   │   └── page.tsx       # Login form
│   │   └── dashboard/
│   │       └── page.tsx       # Protected dashboard
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Card.tsx
│   │   ├── auth/
│   │   │   └── LoginForm.tsx   # Login form component
│   │   └── layout/
│   │       └── Header.tsx      # Navigation header
│   ├── contexts/
│   │   └── AuthContext.tsx    # Authentication state
│   ├── hooks/
│   │   ├── useAuth.ts         # Auth utilities
│   │   └── useApiClient.ts    # API client hook
│   ├── lib/
│   │   ├── apiClient.ts       # API client with token refresh
│   │   ├── auth.ts            # Token management
│   │   ├── utils.ts           # General utilities
│   │   └── validation.ts      # Zod schemas
│   └── types/
│       ├── api.ts             # API response types
│       └── auth.ts            # Auth types
├── .env.example                # Environment variables template
├── .env.local                  # Local environment
└── middleware.ts               # Route protection
```

## 🔧 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env.local` and configure:
```bash
cp .env.example .env.local
```

Update `NEXT_PUBLIC_API_BASE_URL` to point to your Express.js backend:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

### 3. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3001` (or your configured port).

## 🔐 Authentication Flow

### Login Process
1. User submits email/password via login form
2. API call to `POST /api/auth/login`
3. Access token stored in localStorage + cookie
4. Refresh token handled automatically via HttpOnly cookie
5. User redirected to dashboard

### Token Management
- **Access Token**: 15 minutes, stored in localStorage + cookie
- **Refresh Token**: Longer duration, HttpOnly cookie
- **Auto Refresh**: Automatic on 401 responses
- **Logout**: Clears all tokens and redirects

### API Integration
The API client handles:
- Automatic Authorization headers
- 401 → refresh token → retry logic
- Type-safe responses
- Error handling

## 🛡️ Route Protection

### Middleware Protection
Protected routes (`/dashboard`) automatically:
- Check for valid access token
- Redirect unauthenticated users to `/login`
- Prevent authenticated users from accessing `/login`

### Client-Side Protection
Additional protection via `useRequireAuth` hook:
- Client-side auth state validation
- Loading states during auth checks
- Graceful error handling

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration  
- `POST /api/auth/refresh-token` - Token refresh

### Example Usage
- `GET /api/health` - Health check
- `GET /api/sample/items/:id` - Protected data example

## 🎨 UI Components

### Reusable Components
- **Button**: Loading states, variants (primary/secondary/danger)
- **Input**: Form validation, error states
- **Card**: Flexible content containers

### Form Validation
- React Hook Form for form state
- Zod schemas for validation
- Real-time error feedback

## 🔧 Development

### Type Safety
- Strict TypeScript configuration
- Comprehensive API response types
- No `any` types used

### Code Quality
- ESLint + Prettier configured
- Clean, maintainable structure
- Easy to extend for exams

### Performance
- Next.js 15 optimizations
- Efficient bundle size
- Minimal dependencies

## 🚀 Deployment

### Environment Variables
```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
NODE_ENV=production
```

### Build Command
```bash
npm run build
```

### Start Production
```bash
npm start
```

## 📚 Usage Examples

### API Client Usage
```typescript
import { apiClient } from '@/lib/apiClient';

// GET request
const response = await apiClient.get<User>('/api/user/profile');

// POST request
const result = await apiClient.post<CreatePostResponse>('/api/posts', postData);
```

### Form Usage
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/validation';

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(loginSchema),
});
```

## 🔍 Testing Features

### Authentication Testing
1. Navigate to `/login`
2. Use test credentials (from your backend)
3. Verify redirect to `/dashboard`
4. Test protected route access
5. Verify logout functionality

### API Integration Testing
1. Login successfully
2. Visit `/dashboard`
3. Verify sample data loading
4. Test token refresh behavior
5. Verify error handling

## 🎯 Perfect For

- ✅ **1-hour live coding exams**
- ✅ **Production applications**
- ✅ **Learning Next.js 15**
- ✅ **JWT authentication demos**
- ✅ **TypeScript best practices**

## 📄 License

MIT License - feel free to use for projects and exams!

---

**Ready for development and production! 🚀**