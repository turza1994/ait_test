import { Router } from 'express';
import {
  getMyJobsController,
  getApplicantsController,
  getMatchedTalentsController,
  inviteController,
} from '../controllers/employerController.js';
import { authMiddleware } from '../middlewares/auth.js';
import { requireRole } from '../middlewares/roleGuard.js';
import { validate } from '../middlewares/validate.js';
import { inviteSchema } from '../schemas/employer.js';

const router = Router();

router.use(authMiddleware);
router.use(requireRole(['employer']));

router.get('/jobs', getMyJobsController);
router.get('/jobs/:id/applicants', getApplicantsController);
router.get('/matched-talents', getMatchedTalentsController);
router.post('/invite', validate(inviteSchema), inviteController);

export default router;
