import { Router } from 'express';
import {
  listApplicationsController,
  listInvitationsController,
  respondController,
} from '../controllers/talentController.js';
import { authMiddleware } from '../middlewares/auth.js';
import { requireRole } from '../middlewares/roleGuard.js';
import { validate } from '../middlewares/validate.js';
import { respondSchema } from '../schemas/talent.js';

const router = Router();

router.use(authMiddleware);
router.use(requireRole(['talent']));

router.get('/applications', listApplicationsController);
router.get('/invitations', listInvitationsController);
router.post('/invitations/:id/respond', validate(respondSchema), respondController);

export default router;
