import { Module } from '@nestjs/common';
import { TokenUsageService } from './token-usage.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TokenUsageService],
  exports: [TokenUsageService], 
})
export class TokenUsageModule {}
