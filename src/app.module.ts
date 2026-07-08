import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { OauthModule } from './oauth/oauth.module';
import { SongsModule } from './songs/songs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    OauthModule,
    SongsModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService],
})
export class AppModule {}
