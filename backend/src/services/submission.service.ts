import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { judgeQueue } from '../queues/judge.queue';

const prisma = new PrismaClient();

export class SubmissionService {
  async createSubmission(data: any, userId: string, problemId: string) {
    const submission = await prisma.submission.create({
      data: {
        id: uuidv4(),
        code: data.code,
        language: data.language,
        userId,
        problemId,  
        status: 'PENDING',
        createdAt: new Date(),
      },
    });

    await judgeQueue.add({
      submissionId: submission.id,
      code: submission.code,
      language: submission.language,
      problemId,
    });

    return { status: 201, message: 'Submission received', submissionId: submission.id };
  }
}
