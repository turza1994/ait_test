import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  listInvitations,
  listMyApplications,
  respondToInvitation,
} from '../services/talentService.js';
import type { RespondInput } from '../schemas/talent.js';

export const listApplicationsController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const talentId = req.user?.userId;
    if (!talentId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const applications = await listMyApplications(talentId);
    res.json({ success: true, data: applications });
  }
);

export const listInvitationsController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const talentId = req.user?.userId;
    if (!talentId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const invitations = await listInvitations(talentId);
    res.json({ success: true, data: invitations });
  }
);

export const respondController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const talentId = req.user?.userId;
    if (!talentId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const invitationId = Number(req.params.id);
    if (isNaN(invitationId)) {
      res.status(400).json({ success: false, message: 'Invalid invitation ID' });
      return;
    }

    const { status }: RespondInput = req.body;

    try {
      const invitation = await respondToInvitation(
        invitationId,
        talentId,
        status
      );
      res.json({ success: true, data: invitation });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed';
      if (message === 'Invitation not found') {
        res.status(404).json({ success: false, message });
        return;
      }
      if (message === 'Forbidden' || message === 'Invitation already responded') {
        res.status(400).json({ success: false, message });
        return;
      }
      throw err;
    }
  }
);
