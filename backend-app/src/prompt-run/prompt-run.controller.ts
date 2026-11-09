import {Controller,Post,Body,UseGuards,Get,Patch,Param,} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PromptRunService } from './prompt-run.service';
import { CreatePromptRunDto } from './dto/create-prompt-run.dto';
import { CompleteRunDto } from '../prompt/dto/complete-run.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';


@Controller('prompt-runs')
@UseGuards(AuthGuard('jwt'))
export class PromptRunController {
  constructor(
    private readonly promptRunService: PromptRunService,
  ) {}

  @Post()
  async runPrompt(
    @CurrentUser('id') userId: string,
    @Body() dto: CreatePromptRunDto,
  ) {
    return this.promptRunService.create({
      userId,
      ...dto,
    });
  }

  @Get('me')
  async getMyRuns(@CurrentUser('id') userId: string) {
    return this.promptRunService.getRunsByUser(userId);
  }

  @Patch(':id/complete')
completeRun(
  @Param('id') runId: string,
  @CurrentUser('id') userId: string,
  @Body() dto: CompleteRunDto,
) {
  return this.promptRunService.completeRun(runId, userId, dto.output);
}


  
}
