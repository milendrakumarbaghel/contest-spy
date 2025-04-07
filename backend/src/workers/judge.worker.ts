import { Job } from 'bull';
import { PrismaClient } from '@prisma/client';
import { runCodeInDocker } from '../utils/dockerExecutor';

const prisma = new PrismaClient();

type TestCase = {
  input: string;
  output: string;
};

export const judgeSubmission = async (job: Job) => {
  const { submissionId, code, language, problemId } = job.data;

  const problem = await prisma.problem.findUnique({ where: { id: problemId } });
  const testCases = Array.isArray(problem?.testCases)
    ? (problem.testCases as TestCase[])
    : [];

  let passed = 0;

  for (const test of testCases) {
    const result = await runCodeInDocker({
      code: code,
      language: language,
      input: test.input,
    });

    const outputClean = result.stdout.trim();
    const expectedClean = test.output.trim();

    if (outputClean === expectedClean) passed++;
  }

  const score = Math.round((passed / testCases.length) * 100);

  await prisma.submission.update({
    where: { id: submissionId },
    data: {
      status: 'SUCCESS',
      score,
      passedTestCases: passed,
      totalTestCases: testCases.length,
    },
  });
};
