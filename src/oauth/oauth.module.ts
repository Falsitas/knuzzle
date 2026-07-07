import { Module } from '@nestjs/common';
import { KakaoService } from './kakao/kakao.service';

@Module({
  providers: [KakaoService],
  exports: [KakaoService],
})
export class OauthModule {}
