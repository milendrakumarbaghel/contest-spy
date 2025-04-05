import { z } from 'zod';

export const SubmissionSchema = z.object({
  code: z.string().min(1),
  language: z.enum(['cpp', 'python', 'javascript']),
});
