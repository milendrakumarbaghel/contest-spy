import { Request, Response } from 'express';
import { getContestRanking } from '../services/ranking.service';

export const getRankingController = async (req: Request, res: Response) => {
  try {
    const { contestId } = req.params;
    const ranking = await getContestRanking(contestId);
    res.status(200).json({ success: true, ranking });
  } catch (error) {
    console.error('❌ Ranking Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch ranking' });
  }
};
