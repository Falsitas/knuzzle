import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { UpdateSessionDto } from './dto/update-session.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/session')
  updateSession(@Req() req, @Body() dto: UpdateSessionDto) {
    return this.usersService.updatePrimarySession(req.user.id, dto.session);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req) {
    return this.usersService.findMe(req.user.id);
  }
}
