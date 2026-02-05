import { Request, Response, NextFunction } from 'express';
import { randomBytes } from 'crypto';
import { env } from '../config/index.js';

declare module 'express' {
  interface Request {
    csrfToken?: string;
  }
}

export function generateCSRFToken(): string {
  return randomBytes(32).toString('hex');
}

export function validateCSRFToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = req.headers['x-csrf-token'] as string;
  const cookieToken = req.cookies?.['_csrf'];

  if (!token || !cookieToken || token !== cookieToken) {
    res.status(403).json({
      success: false,
      message: 'Invalid CSRF token',
      code: 'CSRF_INVALID',
    });
    return;
  }

  next();
}

export function setCSRFCookie(res: Response, token: string): void {
  res.cookie('_csrf', token, {
    httpOnly: false, // JavaScript needs to read this to send in headers
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
}

export function csrfProtectionMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = generateCSRFToken();
  req.csrfToken = token;
  setCSRFCookie(res, token);
  next();
}
