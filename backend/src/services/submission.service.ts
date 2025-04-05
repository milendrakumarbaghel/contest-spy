import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

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
        status: 'Pending',
        createdAt: new Date(),
      },
    });

    // You'd push submission to judge queue here (next step)

    return { status: 201, message: 'Submission received', submissionId: submission.id };
  }
}
