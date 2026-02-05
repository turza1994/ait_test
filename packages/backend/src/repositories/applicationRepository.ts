import { eq, and, desc } from 'drizzle-orm';
import { db } from '../db/client.js';
import { applications, users, jobs } from '../models/index.js';

export async function createApplication(
  jobId: number,
  talentId: number,
  source: 'manual' | 'invitation'
) {
  const result = await db
    .insert(applications)
    .values({ jobId, talentId, source })
    .returning();
  return result[0];
}

export async function findByJobAndTalent(jobId: number, talentId: number) {
  const result = await db
    .select()
    .from(applications)
    .where(
      and(eq(applications.jobId, jobId), eq(applications.talentId, talentId))
    )
    .limit(1);
  return result[0] ?? null;
}

export async function countByJobId(jobId: number): Promise<number> {
  const result = await db
    .select()
    .from(applications)
    .where(eq(applications.jobId, jobId));
  return result.length;
}

export async function listByJobId(jobId: number) {
  return db
    .select()
    .from(applications)
    .where(eq(applications.jobId, jobId));
}

export async function listByTalentId(talentId: number) {
  return db
    .select()
    .from(applications)
    .where(eq(applications.talentId, talentId));
}

export async function listApplicantsForJob(jobId: number) {
  return db
    .select({
      talentId: applications.talentId,
      name: users.name,
      email: users.email,
      source: applications.source,
    })
    .from(applications)
    .innerJoin(users, eq(applications.talentId, users.id))
    .where(eq(applications.jobId, jobId));
}

export async function listApplicationsByTalentIdWithJob(talentId: number) {
  return db
    .select({
      id: applications.id,
      jobId: applications.jobId,
      source: applications.source,
      createdAt: applications.createdAt,
      title: jobs.title,
      companyName: jobs.companyName,
    })
    .from(applications)
    .innerJoin(jobs, eq(applications.jobId, jobs.id))
    .where(eq(applications.talentId, talentId))
    .orderBy(desc(applications.createdAt));
}
