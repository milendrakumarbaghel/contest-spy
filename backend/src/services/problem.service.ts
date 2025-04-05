import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class ProblemService {
  async createProblem(data: any, contestId: string) {
    const problem = await prisma.problem.create({
      data: {
        title: data.title,
        statement: data.statement,
        inputFormat: data.inputFormat,
        outputFormat: data.outputFormat,
        sampleInput: data.sampleInput,
        sampleOutput: data.sampleOutput,
        testCases: data.testCases,
        contestId,
      },
    });

    return { status: 201, message: 'Problem added successfully', problem };
  }

  async updateProblem(problemId: string, data: any) {
    const updated = await prisma.problem.update({
      where: { id: problemId },
      data,
    });
    return { status: 200, message: 'Problem updated successfully', problem: updated };
  }

  async deleteProblem(problemId: string) {
    await prisma.problem.delete({ where: { id: problemId } });
    return { status: 200, message: 'Problem deleted successfully' };
  }
}
