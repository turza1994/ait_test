import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { signup, login, logout, getMe } from '../services/authService.js';
import { SignupInput, LoginInput } from '../schemas/auth.js';
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from '../utils/cookies.js';
import { generateCSRFToken, setCSRFCookie } from '../middlewares/csrf.js';
import { logger } from '../utils/logger.js';

export const signupController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password, name, role }: SignupInput = req.body;

    const result = await signup(email, password, name, role);

    setRefreshTokenCookie(res, result.refreshToken);

    const csrfToken = generateCSRFToken();
    setCSRFCookie(res, csrfToken);

    const { refreshToken: _refreshToken, ...responseData } = result;

    res.status(201).json({
      success: true,
      data: responseData,
    });
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password }: LoginInput = req.body;

    const result = await login(email, password);

    setRefreshTokenCookie(res, result.refreshToken);

    const csrfToken = generateCSRFToken();
    setCSRFCookie(res, csrfToken);

    const { refreshToken: _refreshToken, ...responseData } = result;

    res.json({
      success: true,
      data: responseData,
    });
  }
);

export const logoutController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const clientIP = req.ip ?? req.connection.remoteAddress ?? 'unknown';

    if (!userId) {
      logger.warn({
        event: 'logout_unauthenticated',
        ip: clientIP,
        userAgent: req.get('User-Agent'),
        message: 'Logout attempt without authentication',
      });

      clearRefreshTokenCookie(res);
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }

    await logout(userId);
    clearRefreshTokenCookie(res);

    logger.info({
      event: 'logout_success',
      userId,
      ip: clientIP,
      userAgent: req.get('User-Agent'),
      message: 'User logged out successfully',
    });

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  }
);

export const meController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }
    const user = await getMe(userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.json({ success: true, data: user });
  }
);
