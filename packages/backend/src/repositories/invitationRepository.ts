import { eq, and } from 'drizzle-orm';
import { db } from '../db/client.js';
import { invitations, jobs, users } from '../models/index.js';

export async function createInvitation(
  jobId: number,
  talentId: number,
  status: 'pending' | 'accepted' | 'declined' = 'pending'
) {
  const result = await db
    .insert(invitations)
    .values({ jobId, talentId, status })
    .returning();
  return result[0];
}

export async function findInvitationById(id: number) {
  const result = await db
    .select()
    .from(invitations)
    .where(eq(invitations.id, id))
    .limit(1);
  return result[0] ?? null;
}

export async function findByJobAndTalent(jobId: number, talentId: number) {
  const result = await db
    .select()
    .from(invitations)
    .where(
      and(eq(invitations.jobId, jobId), eq(invitations.talentId, talentId))
    )
    .limit(1);
  return result[0] ?? null;
}

export async function updateInvitationStatus(
  id: number,
  talentId: number,
  status: 'accepted' | 'declined'
) {
  const result = await db
    .update(invitations)
    .set({ status })
    .where(and(eq(invitations.id, id), eq(invitations.talentId, talentId)))
    .returning();
  return result[0] ?? null;
}

export async function listByTalentId(talentId: number) {
  return db
    .select({
      id: invitations.id,
      jobId: invitations.jobId,
      talentId: invitations.talentId,
      status: invitations.status,
      createdAt: invitations.createdAt,
      title: jobs.title,
      companyName: jobs.companyName,
      deadline: jobs.deadline,
    })
    .from(invitations)
    .innerJoin(jobs, eq(invitations.jobId, jobs.id))
    .where(eq(invitations.talentId, talentId));
}
