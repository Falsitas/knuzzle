import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { UpdateSessionDto } from './dto/update-session.dto';
import { FindUsersDto } from './dto/find-users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query() query: FindUsersDto) {
    return this.usersService.findAll(query);
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
