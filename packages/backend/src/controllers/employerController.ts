import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  getMyJobs,
  getApplicants,
  getMatchedTalents,
  invite as inviteTalent,
} from '../services/employerService.js';
import type { InviteInput } from '../schemas/employer.js';

export const getMyJobsController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const employerId = req.user?.userId;
    if (!employerId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }
    const jobs = await getMyJobs(employerId);
    res.json({ success: true, data: jobs });
  }
);

export const getApplicantsController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const employerId = req.user?.userId;
    if (!employerId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const jobId = Number(req.params.id);
    if (isNaN(jobId)) {
      res.status(400).json({ success: false, message: 'Invalid job ID' });
      return;
    }

    try {
      const applicants = await getApplicants(jobId, employerId);
      res.json({ success: true, data: applicants });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed';
      if (message === 'Job not found') {
        res.status(404).json({ success: false, message });
        return;
      }
      if (message === 'Forbidden') {
        res.status(403).json({ success: false, message });
        return;
      }
      throw err;
    }
  }
);

export const getMatchedTalentsController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const employerId = req.user?.userId;
    if (!employerId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const talents = await getMatchedTalents(employerId);
    res.json({ success: true, data: talents });
  }
);

export const inviteController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const employerId = req.user?.userId;
    if (!employerId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { jobId, talentId }: InviteInput = req.body;

    try {
      const invitation = await inviteTalent(jobId, talentId, employerId);
      res.status(201).json({ success: true, data: invitation });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed';
      if (message === 'Job not found' || message === 'Talent not found') {
        res.status(404).json({ success: false, message });
        return;
      }
      if (message === 'Forbidden') {
        res.status(403).json({ success: false, message });
        return;
      }
      if (message === 'Invitation already exists') {
        res.status(400).json({ success: false, message });
        return;
      }
      throw err;
    }
  }
);
