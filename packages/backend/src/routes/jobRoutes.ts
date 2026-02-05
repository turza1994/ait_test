import { Router } from 'express';
import {
  listJobsController,
  getJobByIdController,
  createJobController,
} from '../controllers/jobController.js';
import { applyController } from '../controllers/applicationController.js';
import { authMiddleware } from '../middlewares/auth.js';
import { requireRole } from '../middlewares/roleGuard.js';
import { validate } from '../middlewares/validate.js';
import { createJobSchema } from '../schemas/job.js';
import { applySchema } from '../schemas/application.js';

const router = Router();

router.get('/', listJobsController);
router.get('/:id', getJobByIdController);
router.post(
  '/',
  authMiddleware,
  requireRole(['employer']),
  validate(createJobSchema),
  createJobController
);
router.post(
  '/:id/apply',
  authMiddleware,
  requireRole(['talent']),
  validate(applySchema),
  applyController
);

export default router;
