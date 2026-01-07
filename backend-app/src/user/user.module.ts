import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserController } from './user.controller';

@Module({
  imports: [PrismaModule],   //  Prisma mutlaka import edilmeli
  providers: [UserService],
  exports: [UserService],    //  AuthModule kullanabilsin diye
  controllers: [UserController],
})
export class UserModule {}
