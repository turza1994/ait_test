import { z } from 'zod';

export const updateSampleItemSchema = z.object({
  counter: z.number().int().min(0),
});

export type UpdateSampleItemInput = z.infer<typeof updateSampleItemSchema>;
