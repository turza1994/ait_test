import { Router } from 'express';
import {
  getSampleItemController,
  updateSampleItemController,
  updateSampleItemWithLockController,
} from '../controllers/sampleController.js';
import { authMiddleware } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { updateSampleItemSchema } from '../schemas/sample.js';

const router = Router();

router.get('/items/:id', authMiddleware, getSampleItemController);
router.put(
  '/items/:id',
  authMiddleware,
  validate(updateSampleItemSchema),
  updateSampleItemController
);
router.put(
  '/items/:id/lock',
  authMiddleware,
  validate(updateSampleItemSchema),
  updateSampleItemWithLockController
);

export default router;
