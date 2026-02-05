import { z } from 'zod';

export const applySchema = z.object({
  source: z.enum(['manual', 'invitation']),
  invitationId: z.coerce.number().int().positive().optional(),
});

export type ApplyInput = z.infer<typeof applySchema>;
