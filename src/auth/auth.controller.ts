import { Controller, Get, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('kakao')
  loginWithKakao(@Res() res: Response) {
    const loginUrl = this.authService.getKakaoLoginUrl();
    return res.redirect(loginUrl);
  }

  @Get('kakao/callback')
  callback(@Query('code') code: string) {
    console.log(code);
    return this.authService.loginWithKakao(code);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req) {
    return this.authService.me(req.user.id);
  }
}
