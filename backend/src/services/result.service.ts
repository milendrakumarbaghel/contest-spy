import { detectPlagiarismCombined } from '../utils/plagrismDetector';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class ResultService {
  async processContestResults(contestId: string) {
    const problems = await prisma.problem.findMany({
      where: { contestId },
      select: { id: true },
    });

    for (const problem of problems) {
      await detectPlagiarismCombined(problem.id);
    }

    const users = await prisma.user.findMany({
      include: {
        submissions: {
          where: { contestId, plagiarized: false },
        },
      },
    });

    const results = users.map((user) => {
      const totalScore = user.submissions.reduce((sum, sub) => sum + sub.score, 0);
      return { userId: user.id, totalScore };
    });

    results.sort((a, b) => b.totalScore - a.totalScore);

    return results;
  }
}
