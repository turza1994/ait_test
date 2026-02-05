import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  getSampleItem,
  incrementSampleItemCounterAtomic,
  incrementSampleItemCounterWithLock,
} from '../services/sampleService.js';
import { UpdateSampleItemInput } from '../schemas/sample.js';

export const getSampleItemController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid ID',
      });
      return;
    }

    const item = await getSampleItem(id);

    res.json({
      success: true,
      data: item,
    });
  }
);

export const updateSampleItemController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid ID',
      });
      return;
    }

    const { counter }: UpdateSampleItemInput = req.body;
    const increment = counter > 0 ? counter : 1;

    const item = await incrementSampleItemCounterAtomic(id, increment);

    res.json({
      success: true,
      data: item,
    });
  }
);

export const updateSampleItemWithLockController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid ID',
      });
      return;
    }

    const { counter }: UpdateSampleItemInput = req.body;
    const increment = counter > 0 ? counter : 1;

    const item = await incrementSampleItemCounterWithLock(id, increment);

    res.json({
      success: true,
      data: item,
    });
  }
);
