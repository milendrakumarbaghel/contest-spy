import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getPlagiarizedSubmissions = async (req: Request, res: Response) => {
  const { contestId } = req.params;
  const subs = await prisma.submission.findMany({
    where: { contestId, plagiarized: true },
    include: { user: true, problem: true },
  });

  res.status(200).json({ plagiarized: subs });
};
