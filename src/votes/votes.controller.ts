import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';

import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  upsert(@Request() req, @Body() dto: CreateVoteDto) {
    return this.votesService.upsert(req.user.id, dto);
  }
}
