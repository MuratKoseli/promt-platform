import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from './auth/decorators/roles.decorator';
import { RolesGuard } from './auth/guards/roles.guard';
import { Role } from './auth/enums/role.enum';
import { CurrentUser } from './auth/decorators/current-user.decorator';

@Controller()
export class AppController {

  @Get()
  health() {
    return { status: 'ok', message: 'API is running 🚀' };
  }

  // @Get('protected')
  // @UseGuards(AuthGuard('jwt'))
  // protectedRoute() {
  //   return { message: 'JWT works 🔐' };
  // }

  @Get('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  adminRoute() {
    return { message: 'Admin access granted 👑' };
  }

 @Get('protected')
  @UseGuards(AuthGuard('jwt'))
  getProtected(@CurrentUser('id') userId: string) {
    return {
    message: 'Protected route',
    userId,
  };
}
}
