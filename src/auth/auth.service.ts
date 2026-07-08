import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KakaoService } from '../oauth/kakao/kakao.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthProvider } from 'generated/prisma/enums';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly kakaoService: KakaoService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  getKakaoLoginUrl(): string {
    const clientId =
      this.configService.getOrThrow<string>('KAKAO_REST_API_KEY');
    const redirectUri =
      this.configService.getOrThrow<string>('KAKAO_REDIRECT_URI');

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
    });

    return `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
  }

  async loginWithKakao(code: string) {
    const token = await this.kakaoService.exchangeCodeForToken(code);
    const kakaoUser = await this.kakaoService.getUserProfile(
      token.access_token,
    );
    const user = await this.prisma.user.upsert({
      where: {
        providerId: String(kakaoUser.id),
      },
      update: {
        nickname: kakaoUser.kakao_account?.profile?.nickname ?? 'unknown',
      },
      create: {
        provider: AuthProvider.KAKAO,
        providerId: String(kakaoUser.id),
        nickname: kakaoUser.kakao_account?.profile?.nickname ?? 'unknown',
        email: kakaoUser.kakao_account?.email,
      },
    });

    const payload = {
      sub: user.id,
      nickname: user.nickname,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
