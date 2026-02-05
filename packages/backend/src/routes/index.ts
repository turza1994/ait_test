import { Router } from 'express';
import authRoutes from './authRoutes.js';
import refreshRoutes from './refreshRoutes.js';
import sampleRoutes from './sampleRoutes.js';
import jobRoutes from './jobRoutes.js';
import employerRoutes from './employerRoutes.js';
import talentRoutes from './talentRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/auth', refreshRoutes);
router.use('/sample', sampleRoutes);
router.use('/jobs', jobRoutes);
router.use('/employer', employerRoutes);
router.use('/talent', talentRoutes);

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
