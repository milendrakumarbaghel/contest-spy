import { z } from 'zod';

export const CreateProblemSchema = z.object({
    title: z.string().min(3).max(100),
    statement: z.string().min(10),
    inputFormat: z.string().min(1),
    outputFormat: z.string().min(1),
    sampleInput: z.string().min(1),
    sampleOutput: z.string().min(1),
    testCases: z.array(
        z.object({
            input: z.string(),
            output: z.string(),
        })
    ),
});
