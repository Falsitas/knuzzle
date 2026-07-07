import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { OauthModule } from 'src/oauth/oauth.module';

@Module({
  imports: [OauthModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
