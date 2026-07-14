import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSongDto } from './dto/create-song.dto';

@Injectable()
export class SongsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(creatorId: number, dto: CreateSongDto) {
    const vocal = await this.prisma.user.findUnique({
      where: {
        id: dto.vocalId,
      },
    });

    if (!vocal) {
      throw new NotFoundException('보컬 사용자를 찾을 수 없습니다.');
    }
    return this.prisma.song.create({
      data: {
        title: dto.title,
        artist: dto.artist,
        referenceUrl: dto.referenceUrl,

        createdBy: {
          connect: {
            id: creatorId,
          },
        },

        vocal: {
          connect: {
            id: dto.vocalId,
          },
        },

        requiredParts: {
          create: dto.requiredParts,
        },
      },
    });
  }

  async findAll() {
    return this.prisma.song.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            nickname: true,
          },
        },
        vocal: {
          select: {
            id: true,
            nickname: true,
          },
        },
        votes: {
          select: {
            user: {
              select: {
                id: true,
                nickname: true,
              },
            },
            voteType: true,
            session: true,
            sessionDetail: true,
          },
        },
        requiredParts: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
