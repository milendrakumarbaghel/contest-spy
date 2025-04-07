import { Job } from 'bull';
import { PrismaClient } from '@prisma/client';
import { runCodeInDocker } from '../utils/dockerExecutor';
import { emitLeaderboardUpdate } from '../socket';
import { redisClient } from '../config/redis';

const prisma = new PrismaClient();

type TestCase = {
  input: string;
  output: string;
};

function isTestCase(obj: any): obj is TestCase {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.input === 'string' &&
    typeof obj.output === 'string'
  );
}

export const judgeSubmission = async (job: Job) => {
  const { submissionId, code, language, problemId } = job.data;

  const submission = await prisma.submission.findUnique({ where: { id: submissionId } });
  if (!submission) {
    console.error(`❌ Submission not found: ${submissionId}`);
    return;
  }

  const problem = await prisma.problem.findUnique({ where: { id: problemId } });
  if (!problem) {
    console.error(`❌ Problem not found: ${problemId}`);
    return;
  }

  const testCasesRaw = Array.isArray(problem.testCases) ? problem.testCases : [];
  const testCases: TestCase[] = testCasesRaw.filter(isTestCase);

  let passed = 0;

  for (const test of testCases) {
    const result = await runCodeInDocker({
      code,
      language,
      input: test.input,
    });

    if (result.stdout.trim() === test.output.trim()) {
      passed++;
    }
  }

  const score = Math.round((passed / testCases.length) * 100);

  const updatedSubmission = await prisma.submission.update({
    where: { id: submissionId },
    data: {
      status: 'SUCCESS',
      score,
      passedTestCases: passed,
      totalTestCases: testCases.length,
    },
  });

  console.log(`✅ Judged: ${submissionId} | Passed: ${passed}/${testCases.length}`);

  // 🔥 Real-time leaderboard update logic
  const contestId = updatedSubmission.contestId;

  const submissions = await prisma.submission.findMany({
    where: { contestId, plagiarized: false },
  });

  const leaderboard = submissions.reduce((acc, sub) => {
    acc[sub.userId] = (acc[sub.userId] || 0) + sub.score;
    return acc;
  }, {} as Record<string, number>);

  const sorted = Object.entries(leaderboard)
    .map(([userId, score]) => ({ userId, score }))
    .sort((a, b) => b.score - a.score);

  emitLeaderboardUpdate(contestId, sorted);
  await redisClient.del(`ranking:${submission.contestId}:*`);
  await redisClient.del(`myrank:${submission.contestId}:${submission.userId}:*`);
};
