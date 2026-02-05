import { Router } from 'express';
import { refreshTokenController } from '../controllers/refreshController.js';
import { validateCSRFToken } from '../middlewares/csrf.js';
import { refreshTokenRateLimitMiddleware } from '../middlewares/rateLimit.js';

const router = Router();

router.post(
  '/refresh-token',
  refreshTokenRateLimitMiddleware,
  validateCSRFToken,
  refreshTokenController
);

export default router;
