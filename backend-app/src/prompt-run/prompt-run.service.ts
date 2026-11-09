import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TokenUsageService } from '../token-usage/token-usage.service';
import { RunStatus } from '@prisma/client';

@Injectable()
export class PromptRunService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenUsageService: TokenUsageService,
  ) {}

  async create({
    promptId,
    userId,
    model,
    input,
  }: {
    promptId: string;
    userId: string;
    model: string;
    input?: string;
  }) {
    const output = `LLM output for prompt ${promptId}`;

    const inputTokens = input ? input.length : 0;
    const outputTokens = output.length;
    const totalTokens = inputTokens + outputTokens;
    const costUsd = totalTokens * 0.00001;

    const promptRun = await this.prisma.promptRun.create({
      data: {
        promptId,
        userId,
        model,
        input,
        output,
      },
    });

    await this.prisma.prompt.update({
      where: { id: promptId },
      data: {
        runCount: { increment: 1 },
      },
    });

    await this.tokenUsageService.create({
      promptRunId: promptRun.id,
      inputTokens,
      outputTokens,
      totalTokens,
      costUsd,
    });

    return promptRun;
  }

  async getRunsByUser(userId: string) {
    return this.prisma.promptRun.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        prompt: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

async completeRun(runId: string, userId: string, output: string) {
  return this.prisma.$transaction(async (tx) => {
    const run = await tx.promptRun.findUnique({
      where: { id: runId },
    });

    if (!run) throw new NotFoundException('Run not found');
    if (run.userId !== userId)
      throw new ForbiddenException('Not your run');

    if (run.status !== RunStatus.PENDING)
      throw new BadRequestException('Run already completed');

    const updatedRun = await tx.promptRun.update({
      where: { id: runId },
      data: {
        output,
        status: RunStatus.COMPLETED,
      },
    });

    await tx.prompt.update({
      where: { id: run.promptId },
      data: {
        runCount: { increment: 1 },
      },
    });

    return updatedRun;
  });
}


  
}

