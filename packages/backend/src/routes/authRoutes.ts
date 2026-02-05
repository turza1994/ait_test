import { Router } from 'express';
import {
  signupController,
  loginController,
  logoutController,
} from '../controllers/authController.js';
import { validate } from '../middlewares/validate.js';
import { authMiddleware } from '../middlewares/auth.js';
import { signupSchema, loginSchema } from '../schemas/auth.js';

const router = Router();

router.post('/signup', validate(signupSchema), signupController);
router.post('/login', validate(loginSchema), loginController);
router.post('/logout', authMiddleware, logoutController);

export default router;
