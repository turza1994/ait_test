import { Request, Response, NextFunction } from 'express';

const ALLOWED_ROLES = ['employer', 'talent'] as const;
export type Role = (typeof ALLOWED_ROLES)[number];

export function requireRole(allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const role = req.user?.role;

    if (!role || !allowedRoles.includes(role as Role)) {
      res.status(403).json({
        success: false,
        message: 'Forbidden: insufficient role',
      });
      return;
    }

    next();
  };
}
