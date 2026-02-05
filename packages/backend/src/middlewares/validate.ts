import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        code: 'VALIDATION_ERROR',
      });
      return;
    }
  };
}
