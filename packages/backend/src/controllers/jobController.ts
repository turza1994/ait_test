import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  listJobs,
  getJobById,
  createJob,
} from '../services/jobService.js';
import type { CreateJobInput } from '../schemas/job.js';

export const listJobsController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const search =
      typeof req.query.search === 'string' ? req.query.search : undefined;
    const jobs = await listJobs({ search });
    res.json({
      success: true,
      data: jobs,
    });
  }
);

export const getJobByIdController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid job ID',
      });
      return;
    }

    const job = await getJobById(id);
    if (!job) {
      res.status(404).json({
        success: false,
        message: 'Job not found',
      });
      return;
    }

    res.json({
      success: true,
      data: job,
    });
  }
);

export const createJobController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const body = req.body as CreateJobInput;
    const job = await createJob(body, userId);

    res.status(201).json({
      success: true,
      data: job,
    });
  }
);
