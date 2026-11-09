import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TokenUsageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    promptRunId: string;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    costUsd: number;
  }) {
    return this.prisma.tokenUsage.create({
      data,
    });
  }
}
