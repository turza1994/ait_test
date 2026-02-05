import {
  listByTalentId,
  updateInvitationStatus,
  findInvitationById,
} from '../repositories/invitationRepository.js';
import {
  createApplication,
  findByJobAndTalent,
  listApplicationsByTalentIdWithJob,
} from '../repositories/applicationRepository.js';
import { findJobById } from '../repositories/jobRepository.js';

export async function listInvitations(talentId: number) {
  return listByTalentId(talentId);
}

export async function listMyApplications(talentId: number) {
  return listApplicationsByTalentIdWithJob(talentId);
}

export async function respondToInvitation(
  invitationId: number,
  talentId: number,
  status: 'accepted' | 'declined'
) {
  const invitation = await findInvitationById(invitationId);
  if (!invitation) {
    throw new Error('Invitation not found');
  }
  if (invitation.talentId !== talentId) {
    throw new Error('Forbidden');
  }
  if (invitation.status !== 'pending') {
    throw new Error('Invitation already responded');
  }

  const updated = await updateInvitationStatus(invitationId, talentId, status);
  if (!updated) {
    throw new Error('Failed to update invitation');
  }

  if (status === 'accepted') {
    const job = await findJobById(invitation.jobId);
    if (job && new Date(job.deadline) >= new Date()) {
      const existing = await findByJobAndTalent(invitation.jobId, talentId);
      if (!existing) {
        await createApplication(invitation.jobId, talentId, 'invitation');
      }
    }
  }

  return updated;
}
