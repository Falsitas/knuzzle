import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() dto: CreateSongDto) {
    return this.songsService.create(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.songsService.findAll();
  }
}
