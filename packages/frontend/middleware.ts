import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get access token from cookie (set by AuthContext)
  const token = request.cookies.get('access_token')?.value;

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/signup', '/'];
  
  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard'];

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Check if the current path is public (not currently used, kept for documentation)
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname === '/'
  );

  // Redirect logic
  if (isProtectedRoute && !token) {
    // Redirect to login if trying to access protected route without token
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If user is authenticated and tries to access login/signup, redirect to dashboard
  if (token && (pathname === '/login' || pathname === '/signup')) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};