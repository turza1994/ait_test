import { Response } from 'express';
import { env } from '../config/index.js';

export interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  maxAge: number;
  path: string;
}

export function getRefreshTokenCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/api',
  };
}

export function setRefreshTokenCookie(
  res: Response,
  refreshToken: string
): void {
  const options = getRefreshTokenCookieOptions();
  res.cookie(env.REFRESH_TOKEN_COOKIE_NAME, refreshToken, options);
}

export function clearRefreshTokenCookie(res: Response): void {
  const options = getRefreshTokenCookieOptions();
  res.cookie(env.REFRESH_TOKEN_COOKIE_NAME, '', {
    ...options,
    maxAge: 0,
    expires: new Date(0),
  });
}
