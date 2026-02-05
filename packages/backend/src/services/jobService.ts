import {
  createJob as createJobRepo,
  findJobById,
  listJobs as listJobsRepo,
  countApplicationsByJobId,
} from '../repositories/jobRepository.js';
import type { CreateJobInput, ListJobsQuery } from '../schemas/job.js';

/**
 * Stub for AI JD generation. Replace with LLM call:
 * "Generate a professional job description for role {title} with tech stack {techStack}."
 */
function generateJobDescription(title: string, techStack: string): string {
  return `Role: ${title}. Required skills: ${techStack}.`;
}

export async function listJobs(query: ListJobsQuery) {
  const filters =
    query.search !== undefined && query.search !== ''
      ? { search: query.search }
      : {};
  return listJobsRepo(filters);
}

export async function getJobById(id: number) {
  const job = await findJobById(id);
  if (!job) return null;
  const applicationCount = await countApplicationsByJobId(job.id);
  return {
    ...job,
    applicationCount,
  };
}

export async function createJob(
  input: CreateJobInput,
  employerId: number
) {
  const deadline = new Date(input.deadline);
  const description =
    input.description?.trim() ||
    generateJobDescription(input.title, input.techStack);

  const job = await createJobRepo({
    title: input.title,
    techStack: input.techStack,
    description,
    deadline,
    employerId,
    companyName: input.companyName,
  });

  if (!job) {
    throw new Error('Failed to create job');
  }

  return {
    ...job,
    applicationCount: 0,
  };
}
