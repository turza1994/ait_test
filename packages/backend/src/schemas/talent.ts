import { z } from 'zod';

export const respondSchema = z.object({
  status: z.enum(['accepted', 'declined']),
});

export type RespondInput = z.infer<typeof respondSchema>;
