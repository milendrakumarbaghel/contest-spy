import { Request, Response } from 'express';
import { ProblemService } from '../services/problem.service';

const problemService = new ProblemService();

export const createProblem = async (req: Request, res: Response) => {
  const contestId = req.params.contestId;
  const result = await problemService.createProblem(req.body, contestId);
  res.status(result.status).json(result);
};

export const updateProblem = async (req: Request, res: Response) => {
  const problemId = req.params.problemId;
  const result = await problemService.updateProblem(problemId, req.body);
  res.status(result.status).json(result);
};

export const deleteProblem = async (req: Request, res: Response) => {
  const problemId = req.params.problemId;
  const result = await problemService.deleteProblem(problemId);
  res.status(result.status).json(result);
};
