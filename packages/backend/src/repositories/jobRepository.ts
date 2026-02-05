import { eq, sql, ilike, desc } from 'drizzle-orm';
import { db } from '../db/client.js';
import { jobs, applications } from '../models/index.js';

export async function createJob(data: {
  title: string;
  techStack: string;
  description: string;
  deadline: Date;
  employerId: number;
  companyName: string;
}) {
  const result = await db.insert(jobs).values(data).returning();
  return result[0];
}

export async function findJobById(id: number) {
  const result = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  return result[0] ?? null;
}

export async function countApplicationsByJobId(jobId: number): Promise<number> {
  const result = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(applications)
    .where(eq(applications.jobId, jobId));
  return result[0]?.count ?? 0;
}

export async function listJobs(filters: { search?: string } = {}) {
  const baseQuery = db
    .select({
      id: jobs.id,
      title: jobs.title,
      techStack: jobs.techStack,
      description: jobs.description,
      deadline: jobs.deadline,
      employerId: jobs.employerId,
      companyName: jobs.companyName,
      createdAt: jobs.createdAt,
      applicationCount: sql<number>`(select count(*)::int from ${applications} where ${applications.jobId} = ${jobs.id})`,
    })
    .from(jobs)
    .orderBy(desc(jobs.createdAt));

  if (filters.search?.trim()) {
    const searchPattern = `%${filters.search.trim()}%`;
    return db
      .select({
        id: jobs.id,
        title: jobs.title,
        techStack: jobs.techStack,
        description: jobs.description,
        deadline: jobs.deadline,
        employerId: jobs.employerId,
        companyName: jobs.companyName,
        createdAt: jobs.createdAt,
        applicationCount: sql<number>`(select count(*)::int from ${applications} where ${applications.jobId} = ${jobs.id})`,
      })
      .from(jobs)
      .where(ilike(jobs.title, searchPattern))
      .orderBy(desc(jobs.createdAt));
  }

  return baseQuery;
}

export async function listJobsByEmployerId(employerId: number) {
  return db
    .select({
      id: jobs.id,
      title: jobs.title,
      techStack: jobs.techStack,
      description: jobs.description,
      deadline: jobs.deadline,
      employerId: jobs.employerId,
      companyName: jobs.companyName,
      createdAt: jobs.createdAt,
      applicationCount: sql<number>`(select count(*)::int from ${applications} where ${applications.jobId} = ${jobs.id})`,
    })
    .from(jobs)
    .where(eq(jobs.employerId, employerId))
    .orderBy(desc(jobs.createdAt));
}
