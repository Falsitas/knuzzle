import { Controller, Get, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';

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
}
