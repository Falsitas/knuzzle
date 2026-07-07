import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KakaoService } from '../oauth/kakao/kakao.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly kakaoService: KakaoService,
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
    return this.kakaoService.exchangeCodeForToken(code);
  }
}
