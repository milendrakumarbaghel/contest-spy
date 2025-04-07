import { Request, Response } from 'express';
import { getContestRanking, getUserRankInContest } from '../services/ranking.service';

export const getRankingController = async (req: Request, res: Response) => {
  try {
    const { contestId } = req.params;
    const {
      page = '1',
      limit = '10',
      timeframe = 'all',
      language,
      problemId,
    } = req.query;

    const result = await getContestRanking({
      contestId,
      page: Number(page),
      limit: Number(limit),
      timeframe: String(timeframe),
      language: language ? String(language) : undefined,
      problemId: problemId ? String(problemId) : undefined,
    });

    res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error('❌ Ranking Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch ranking' });
  }
};

export const getMyRankController = async (req: Request, res: Response) => {
  try {
    const { contestId } = req.params;
    const userId = (req as Request & { user: { id: string } }).user.id;
    const {
      timeframe = 'all',
      language,
      problemId,
    } = req.query;

    const myRank = await getUserRankInContest(
      contestId,
      userId,
      String(timeframe),
      language ? String(language) : undefined,
      problemId ? String(problemId) : undefined
    );

    res.status(200).json({ success: true, myRank });
  } catch (error) {
    console.error('❌ My Rank Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user rank' });
  }
};
