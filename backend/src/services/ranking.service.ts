import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getContestRanking = async (contestId: string) => {
  // Get all valid submissions (non-plagiarized)
  const validSubmissions = await prisma.submission.findMany({
    where: {
      contestId,
      plagiarized: false,
    },
    select: {
      userId: true,
      score: true,
    },
  });

  const leaderboardMap: Record<string, number> = {};

  for (const sub of validSubmissions) {
    leaderboardMap[sub.userId] = (leaderboardMap[sub.userId] || 0) + sub.score;
  }

  // Map to sorted list
  const sortedLeaderboard = Object.entries(leaderboardMap)
    .map(([userId, score]) => ({ userId, score }))
    .sort((a, b) => b.score - a.score)
    .map((entry, index) => ({
      rank: index + 1,
      ...entry,
    }));

  // Also get plagiarized users
  const flaggedUsers = await prisma.submission.findMany({
    where: {
      contestId,
      plagiarized: true,
    },
    select: {
      userId: true,
    },
    distinct: ['userId'],
  });

  return {
    leaderboard: sortedLeaderboard,
    flagged: flaggedUsers.map((u) => u.userId),
  };
};
