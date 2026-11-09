import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { PromptModule } from './prompt/prompt.module';
import { PromptRunModule } from './prompt-run/prompt-run.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    PromptModule,
    PromptRunModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Global JWT Guard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // Global Roles Guard
    },
  ],
})
export class AppModule {}
