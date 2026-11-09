import { Module } from '@nestjs/common';
import { PromptRunService } from './prompt-run.service';
import { PromptRunController } from './prompt-run.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { TokenUsageModule } from 'src/token-usage/token-usage.module';

@Module({
  imports: [PrismaModule,TokenUsageModule],
  controllers: [PromptRunController],
  providers: [PromptRunService],
})
export class PromptRunModule {}
