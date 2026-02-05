import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { applyToJob } from '../services/applicationService.js';
import type { ApplyInput } from '../schemas/application.js';

export const applyController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const talentId = req.user?.userId;
    if (!talentId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const jobId = Number(req.params.id);
    if (isNaN(jobId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid job ID',
      });
      return;
    }

    const body = req.body as ApplyInput;
    try {
      const application = await applyToJob(jobId, talentId, body);
      res.status(201).json({
        success: true,
        data: application,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Apply failed';
      if (
        message === 'Job not found' ||
        message === 'Application deadline has passed' ||
        message === 'Invalid or not accepted invitation'
      ) {
        res.status(400).json({ success: false, message });
        return;
      }
      if (message === 'Already applied to this job') {
        res.status(400).json({ success: false, message });
        return;
      }
      throw err;
    }
  }
);
