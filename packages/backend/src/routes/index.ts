import { Router } from 'express';
import authRoutes from './authRoutes.js';
import refreshRoutes from './refreshRoutes.js';
import sampleRoutes from './sampleRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/auth', refreshRoutes);
router.use('/sample', sampleRoutes);

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
