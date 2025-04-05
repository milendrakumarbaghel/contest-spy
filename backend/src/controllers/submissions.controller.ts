import { Request, Response } from 'express';
import { SubmissionService } from '../services/submission.service';

const submissionService = new SubmissionService();

export const submitSolution = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const problemId = req.params.problemId;
  const result = await submissionService.createSubmission(req.body, userId, problemId);
  res.status(result.status).json(result);
};
