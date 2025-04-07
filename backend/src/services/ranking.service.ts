import { PrismaClient } from '@prisma/client';
import { subDays } from 'date-fns';
import { redisClient } from '../config/redis';

const prisma = new PrismaClient();

interface RankingOptions {
  contestId: string;
  page: number;
  limit: number;
  timeframe: string;
  language?: string;
  problemId?: string;
}

export const getContestRanking = async ({
  contestId,
  page,
  limit,
  timeframe,
  language,
  problemId,
}: RankingOptions) => {
  const skip = (page - 1) * limit;

  const cacheKey = `ranking:${contestId}:${page}:${limit}:${timeframe}:${language || 'all'}:${problemId || 'all'}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const dateFilter = timeframe !== 'all'
    ? { createdAt: { gte: subDays(new Date(), parseInt(timeframe)) } }
    : {};

  const where = {
    contestId,
    plagiarized: false,
    ...dateFilter,
    ...(language ? { language } : {}),
    ...(problemId ? { problemId } : {}),
  };

  const submissions = await prisma.submission.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });

  const leaderboardMap = new Map<string, { user: any; score: number }>();

  for (const sub of submissions) {
    if (!leaderboardMap.has(sub.userId)) {
      leaderboardMap.set(sub.userId, { user: sub.user, score: 0 });
    }
    leaderboardMap.get(sub.userId)!.score += sub.score;
  }

  const sorted = Array.from(leaderboardMap.values())
    .sort((a, b) => b.score - a.score)
    .map((entry, index) => ({
      rank: index + 1,
      userId: entry.user.id,
      name: entry.user.username,
      email: entry.user.email,
      score: entry.score,
    }));

  const paginated = sorted.slice(skip, skip + limit);

  const plagiarizedUsers = await prisma.submission.findMany({
    where: { contestId, plagiarized: true },
    select: {
      user: { select: { id: true, username: true, email: true } },
    },
    distinct: ['userId'],
  });

  const result = {
    leaderboard: paginated,
    total: sorted.length,
    page,
    limit,
    flagged: plagiarizedUsers.map((p) => p.user),
  };

  await redisClient.setex(cacheKey, 60, JSON.stringify(result)); // Cache for 60 sec
  return result;
};

export const getUserRankInContest = async (
  contestId: string,
  userId: string,
  timeframe: string,
  language?: string,
  problemId?: string
) => {
  const cacheKey = `myrank:${contestId}:${userId}:${timeframe}:${language || 'all'}:${problemId || 'all'}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const dateFilter = timeframe !== 'all'
    ? { createdAt: { gte: subDays(new Date(), parseInt(timeframe)) } }
    : {};

  const where = {
    contestId,
    plagiarized: false,
    ...dateFilter,
    ...(language ? { language } : {}),
    ...(problemId ? { problemId } : {}),
  };

  const submissions = await prisma.submission.findMany({
    where,
    select: {
      userId: true,
      score: true,
    },
  });

  const scores: Record<string, number> = {};
  for (const sub of submissions) {
    scores[sub.userId] = (scores[sub.userId] || 0) + sub.score;
  }

  const sorted = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .map(([id], index) => ({ userId: id, rank: index + 1 }));

  const userEntry = sorted.find((u) => u.userId === userId) ?? { rank: null, message: 'No submissions yet' };

  await redisClient.setex(cacheKey, 60, JSON.stringify(userEntry)); // Cache for 60 sec
  return userEntry;
};
