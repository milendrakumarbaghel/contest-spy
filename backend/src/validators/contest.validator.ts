import { z } from 'zod';

export const CreateContestSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
});
