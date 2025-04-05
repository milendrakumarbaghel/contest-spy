import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class ContestService {
  async createContest(data: any, userId: string) {
    const contest = await prisma.contest.create({
      data: {
        title: data.title,
        description: data.description,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        createdById: userId,
      },
    });

    return { status: 201, message: 'Contest created successfully', contest };
  }
}
