import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePromptDto } from './dto/create-prompt.dto';

@Injectable()
export class PromptService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, dto: CreatePromptDto) {
    return this.prisma.prompt.create({
      data: {
        title: dto.title,
        content: dto.content,
        isPublic: dto.isPublic ?? false,
        userId,
      },
    });
  }

  findPublic() {
    return this.prisma.prompt.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async forkPrompt({
    originalPromptId,
    userId,
    title,
  }: {
    originalPromptId: string;
    userId: string;
    title: string;
  }) {
    return this.prisma.$transaction(async (tx) => {
      const originalPrompt = await tx.prompt.findUnique({
        where: { id: originalPromptId },
      });

      if (!originalPrompt) {
        throw new NotFoundException('Prompt not found');
      }

      const forkedPrompt = await tx.prompt.create({
        data: {
          title,
          content: originalPrompt.content,
          isPublic: false,
          userId,
          forkedFromId: originalPrompt.id,
        },
      });

      await tx.prompt.update({
        where: { id: originalPrompt.id },
        data: {
          forkCount: { increment: 1 },
        },
      });

      return forkedPrompt;
    });
  }

  async getForkTree(promptId: string) {
    const prompt = await this.prisma.prompt.findUnique({
      where: { id: promptId },
      include: {
        forkedFrom: {
          select: { id: true, title: true, userId: true },
        },
        forks: {
          select: {
            id: true,
            title: true,
            userId: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!prompt) {
      throw new NotFoundException('Prompt not found');
    }

    return {
      current: {
        id: prompt.id,
        title: prompt.title,
        userId: prompt.userId,
        createdAt: prompt.createdAt,
      },
      parent: prompt.forkedFrom,
      children: prompt.forks,
    };
  }


  async getDiscoverPrompts() {
    return this.prisma.prompt.findMany({
      where: { isPublic: true },
      orderBy: { forkCount: 'desc' },
      take: 20,
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  // 🧬 Prompt + Fork + Run’lar
  async getPromptWithForkRuns(promptId: string) {
    return this.prisma.prompt.findUnique({
      where: { id: promptId },
      include: {
        runs: true,
        forks: {
          include: {
            runs: true,
          },
        },
      },
    });
  }

  
  async getPopularPrompts(limit = 10) {
    return this.prisma.prompt.findMany({
      where: { isPublic: true },
      orderBy: { forkCount: 'desc' },
      take: limit,
      select: {
        id: true,
        title: true,
        content: true,
        forkCount: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  
  async getPromptDetail(promptId: string, currentUserId?: string) {
  const prompt = await this.prisma.prompt.findUnique({
    where: { id: promptId },
    include: {
      user: { select: { id: true, email: true } },
      forkedFrom: { select: { id: true, title: true } },
      runs: {
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: {
          id: true,
          model: true,
          status: true,
          createdAt: true,
        },
      },
      _count: { select: { forks: true, runs: true } },
    },
  });

  if (!prompt) throw new NotFoundException('Prompt not found');

  if (!prompt.isPublic && prompt.userId !== currentUserId) {
    throw new ForbiddenException('You do not have access to this prompt');
  }

  return {
    id: prompt.id,
    title: prompt.title,
    content: prompt.content,
    isPublic: prompt.isPublic,
    createdAt: prompt.createdAt,
    user: prompt.user,
    forkedFrom: prompt.forkedFrom,
    stats: {
      forkCount: prompt._count.forks,
      runCount: prompt._count.runs,
    },
    runsPreview: prompt.runs,
  };
}



async runPrompt({
  promptId,
  userId,
  input,
}: {
  promptId: string;
  userId: string;
  input?: string;
}) {
  return this.prisma.$transaction(async (tx) => {
    const prompt = await tx.prompt.findUnique({
      where: { id: promptId },
    });

    if (!prompt) {
      throw new NotFoundException('Prompt not found');
    }

 const run = await tx.promptRun.create({
  data: {
    prompt: {
      connect: { id: promptId },
    },
    user: {
      connect: { id: userId },
    },
    model: 'gpt-4o-mini',
    input: input ?? '',     
    output: '',             
  },
});

    await tx.prompt.update({
      where: { id: promptId },
      data: {
        runCount: { increment: 1 },
      },
    });

    return run;
  });
}

async getPromptRuns(promptId: string, currentUserId: string) {
  const prompt = await this.prisma.prompt.findUnique({
    where: { id: promptId },
  });

  if (!prompt) throw new NotFoundException('Prompt not found');

  if (prompt.userId !== currentUserId) {
    throw new ForbiddenException('You cannot view runs of this prompt');
  }

  return this.prisma.promptRun.findMany({
    where: { promptId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      model: true,
      status: true,
      createdAt: true,
      user: {
        select: { id: true, email: true },
      },
    },
  });
}



async createRun({
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
  return this.prisma.$transaction(async (tx) => {
    const prompt = await tx.prompt.findUnique({
      where: { id: promptId },
    });

    if (!prompt) {
      throw new NotFoundException('Prompt not found');
    }

    const run = await tx.promptRun.create({
      data: {
        prompt: { connect: { id: promptId } },
        user: { connect: { id: userId } },
        model,
        input,
        output: '',
        status: 'PENDING',
      },
    });

    return run;
  });
}

async completeRun(runId: string, output: string) {
  return this.prisma.promptRun.update({
    where: { id: runId },
    data: {
      output,
      status: 'COMPLETED',
    },
  });
}

async failRun(runId: string) {
  return this.prisma.promptRun.update({
    where: { id: runId },
    data: {
      status: 'FAILED',
    },
  });
}


}
