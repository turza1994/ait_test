import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error({
    msg: 'Unhandled error',
    error: error.message,
    stack: error.stack,
  });

  if (
    error.message.includes('Invalid credentials') ||
    error.message.includes('Invalid refresh token') ||
    error.message.includes('Email already exists') ||
    error.message.includes('Sample item not found')
  ) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
    return;
  }

  if (error.message.includes('not found')) {
    res.status(404).json({
      success: false,
      message: 'Resource not found',
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
}
