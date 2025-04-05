import { Request, Response } from 'express';
import { ContestService } from '../services/contest.service';

const contestService = new ContestService();

export const createContest = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const result = await contestService.createContest(req.body, userId);
  res.status(result.status).json(result);
};
