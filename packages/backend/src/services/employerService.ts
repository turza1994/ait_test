import {
  findJobById,
  listJobsByEmployerId,
} from '../repositories/jobRepository.js';
import { listApplicantsForJob } from '../repositories/applicationRepository.js';
import { listTalents } from '../repositories/userRepository.js';
import {
  createInvitation,
  findByJobAndTalent,
} from '../repositories/invitationRepository.js';
import { findUserById } from '../repositories/userRepository.js';

/**
 * Stub for AI match score. Replace with prompt-based relevance (0–100).
 */
function getMatchScore(talentId: number, _employerId: number): number {
  return 50 + (talentId % 50);
}

export async function getMyJobs(employerId: number) {
  return listJobsByEmployerId(employerId);
}

export async function getApplicants(jobId: number, employerId: number) {
  const job = await findJobById(jobId);
  if (!job) {
    throw new Error('Job not found');
  }
  if (job.employerId !== employerId) {
    throw new Error('Forbidden');
  }
  return listApplicantsForJob(jobId);
}

export async function getMatchedTalents(employerId: number) {
  const talents = await listTalents();
  return talents.map((t) => ({
    id: t.id,
    name: t.name,
    email: t.email,
    matchScore: getMatchScore(t.id, employerId),
  }));
}

export async function invite(jobId: number, talentId: number, employerId: number) {
  const job = await findJobById(jobId);
  if (!job) {
    throw new Error('Job not found');
  }
  if (job.employerId !== employerId) {
    throw new Error('Forbidden');
  }

  const talent = await findUserById(talentId);
  if (!talent || talent.role !== 'talent') {
    throw new Error('Talent not found');
  }

  const existing = await findByJobAndTalent(jobId, talentId);
  if (existing) {
    throw new Error('Invitation already exists');
  }

  const invitation = await createInvitation(jobId, talentId, 'pending');
  if (!invitation) {
    throw new Error('Failed to create invitation');
  }
  return invitation;
}
