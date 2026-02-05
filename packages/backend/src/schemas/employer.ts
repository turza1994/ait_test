import { z } from 'zod';

export const inviteSchema = z.object({
  jobId: z.coerce.number().int().positive(),
  talentId: z.coerce.number().int().positive(),
});

export type InviteInput = z.infer<typeof inviteSchema>;
