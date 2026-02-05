import { z } from 'zod';

export const createJobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  techStack: z.string().min(1, 'Tech stack is required'),
  description: z.string().optional(),
  deadline: z.string().min(1, 'Deadline is required'),
  companyName: z.string().min(1, 'Company name is required'),
});

export const listJobsQuerySchema = z.object({
  search: z.string().optional(),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type ListJobsQuery = z.infer<typeof listJobsQuerySchema>;
