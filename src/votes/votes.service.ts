import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateVoteDto } from './dto/create-vote.dto';

@Injectable()
export class VotesService {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(userId: number, dto: CreateVoteDto) {
    // 곡이 존재하는지 확인
    const song = await this.prisma.song.findUnique({
      where: {
        id: dto.songId,
      },
    });

    if (!song) {
      throw new NotFoundException('곡을 찾을 수 없습니다.');
    }

    // 이미 투표했으면 수정, 아니면 생성
    return this.prisma.vote.upsert({
      where: {
        userId_songId: {
          userId,
          songId: dto.songId,
        },
      },

      update: {
        voteType: dto.voteType,
        session: dto.session,
        sessionDetail: dto.sessionDetail,
      },

      create: {
        user: {
          connect: {
            id: userId,
          },
        },

        song: {
          connect: {
            id: dto.songId,
          },
        },

        voteType: dto.voteType,
        session: dto.session,
        sessionDetail: dto.sessionDetail,
      },
    });
  }
}
