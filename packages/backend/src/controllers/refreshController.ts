import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { refreshToken } from '../services/authService.js';
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from '../utils/cookies.js';
import { env } from '../config/index.js';
import { logger } from '../utils/logger.js';

export const refreshTokenController = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshTokenString = req.cookies?.[env.REFRESH_TOKEN_COOKIE_NAME];
    const clientIP = req.ip ?? req.connection.remoteAddress ?? 'unknown';

    if (!refreshTokenString) {
      logger.warn({
        event: 'refresh_token_missing',
        ip: clientIP,
        userAgent: req.get('User-Agent'),
        message: 'Refresh token required but not provided',
      });

      clearRefreshTokenCookie(res);
      res.status(401).json({
        success: false,
        message: 'Refresh token required',
      });
      return;
    }

    try {
      const result = await refreshToken(refreshTokenString);

      logger.info({
        event: 'refresh_token_success',
        userId: result.accessToken ? 'valid' : 'unknown',
        ip: clientIP,
        userAgent: req.get('User-Agent'),
        message: 'Access token refreshed successfully',
      });

      setRefreshTokenCookie(res, result.refreshToken);

      const { refreshToken: _newRefreshToken, ...responseData } = result;

      res.json({
        success: true,
        data: responseData,
      });
    } catch (error) {
      logger.warn({
        event: 'refresh_token_invalid',
        error: error instanceof Error ? error.message : 'Unknown error',
        ip: clientIP,
        userAgent: req.get('User-Agent'),
        message: 'Invalid refresh token attempt',
      });

      clearRefreshTokenCookie(res);
      res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
      return;
    }
  }
);
