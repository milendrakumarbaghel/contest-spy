import { Job } from 'bull';
import { PrismaClient, SubmissionStatus } from '@prisma/client';

const prisma = new PrismaClient();

type TestCase = { input: string; output: string };

export const judgeSubmission = async (job: Job) => {
  const { submissionId, code, language, problemId } = job.data;

  // Fetch test cases
  const problem = await prisma.problem.findUnique({ where: { id: problemId } });

  const testCases: TestCase[] = Array.isArray(problem?.testCases)
    ? (problem!.testCases as TestCase[])
    : [];

  // Simulate judging (placeholder logic)
  let passed = 0;
  for (const test of testCases) {
    if (test && test.input && code.includes(test.input)) {
      passed++;
    }
  }

  const score = testCases.length > 0 ? Math.round((passed / testCases.length) * 100) : 0;

  await prisma.submission.update({
    where: { id: submissionId },
    data: {
      status: SubmissionStatus.SUCCESS,
      score,
    },
  });
};
