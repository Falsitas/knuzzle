import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { KakaoTokenResponse } from './types/kakao-token-response.type';

@Injectable()
export class KakaoService {
  constructor(private readonly configService: ConfigService) {}

  async exchangeCodeForToken(code: string): Promise<KakaoTokenResponse> {
    const clientId =
      this.configService.getOrThrow<string>('KAKAO_REST_API_KEY');

    const clientSecret = this.configService.getOrThrow<string>(
      'KAKAO_CLIENT_SECRET',
    );

    const redirectUri =
      this.configService.getOrThrow<string>('KAKAO_REDIRECT_URI');

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code,
    });

    const response = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      body,
    });

    if (!response.ok) {
      const error = await response.text();

      throw new InternalServerErrorException(
        `Kakao token request failed: ${error}`,
      );
    }

    return (await response.json()) as KakaoTokenResponse;
  }
}
