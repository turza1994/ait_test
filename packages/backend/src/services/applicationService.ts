import { findJobById } from '../repositories/jobRepository.js';
import {
  createApplication,
  findByJobAndTalent,
} from '../repositories/applicationRepository.js';
import { findInvitationById } from '../repositories/invitationRepository.js';
import type { ApplyInput } from '../schemas/application.js';

export async function applyToJob(
  jobId: number,
  talentId: number,
  input: ApplyInput
) {
  const job = await findJobById(jobId);
  if (!job) {
    throw new Error('Job not found');
  }

  const now = new Date();
  if (new Date(job.deadline) < now) {
    throw new Error('Application deadline has passed');
  }

  const existing = await findByJobAndTalent(jobId, talentId);
  if (existing) {
    throw new Error('Already applied to this job');
  }

  if (input.source === 'invitation') {
    const invitationId = input.invitationId;
    if (!invitationId) {
      throw new Error('invitationId required when source is invitation');
    }
    const invitation = await findInvitationById(invitationId);
    if (
      !invitation ||
      invitation.jobId !== jobId ||
      invitation.talentId !== talentId ||
      invitation.status !== 'accepted'
    ) {
      throw new Error('Invalid or not accepted invitation');
    }
  }

  const application = await createApplication(jobId, talentId, input.source);
  if (!application) {
    throw new Error('Failed to create application');
  }

  return application;
}
