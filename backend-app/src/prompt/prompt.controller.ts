import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PromptService } from './prompt.service';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ForkPromptDto } from './dto/fork-prompt.dto';

@Controller('prompts')
export class PromptController {
  constructor(private readonly promptService: PromptService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createPrompt(
    @CurrentUser('id') userId: string,
    @Body() dto: CreatePromptDto,
  ) {
    return this.promptService.create(userId, dto);
  }

  @Get('public')
  getPublicPrompts() {
    return this.promptService.findPublic();
  }

@Post(':id/fork')
@UseGuards(AuthGuard('jwt'))
async forkPrompt(
  @Param('id') promptId: string,
  @CurrentUser('id') userId: string,
  @Body() dto: ForkPromptDto,
) {
  return this.promptService.forkPrompt({
    originalPromptId: promptId,
    userId,
    title: dto.title,
  });
}

@Get('discover')
async discover() {
  return this.promptService.getDiscoverPrompts();
}

@Get(':id/forks')
async getForkTree(@Param('id') promptId: string) {
  return this.promptService.getForkTree(promptId);
}

@Get('popular')
async getPopularPrompts() {
  return this.promptService.getPopularPrompts();
}

@Get(':id')
getPromptDetail(
  @Param('id') id: string,
  @CurrentUser('id') userId?: string,
) {
  return this.promptService.getPromptDetail(id, userId);
}

@Post(':id/run')
@UseGuards(AuthGuard('jwt'))
async runPrompt(
  @Param('id') promptId: string,
  @CurrentUser('id') userId: string,
  @Body() body: { input?: string },
) {
  return this.promptService.runPrompt({
    promptId,
    userId,
    input: body.input,
  });
}

@Get(':id/runs')
@UseGuards(AuthGuard('jwt'))
getPromptRuns(
  @Param('id') id: string,
  @CurrentUser('id') userId: string,
) {
  return this.promptService.getPromptRuns(id, userId);
}



}
