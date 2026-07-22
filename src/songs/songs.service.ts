import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';

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

  async findAll(userId: number) {
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
          where: {
            userId,
          },
          select: {
            id: true,
            song: true,
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

  async findOne(id: number) {
    const song = await this.prisma.song.findUnique({
      where: { id },
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
        requiredParts: true,
      },
    });

    if (!song) {
      throw new NotFoundException();
    }

    return song;
  }

  async update(id: number, userId: number, dto: UpdateSongDto) {
    const song = await this.prisma.song.findUnique({
      where: { id },
      select: {
        createdById: true,
      },
    });

    if (!song) {
      throw new NotFoundException();
    }

    if (song.createdById !== userId) {
      throw new ForbiddenException();
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.song.update({
        where: { id },
        data: {
          title: dto.title,
          artist: dto.artist,
          referenceUrl: dto.referenceUrl,
          vocalId: dto.vocalId,
        },
      });

      await tx.songRequiredPart.deleteMany({
        where: {
          songId: id,
        },
      });

      await tx.songRequiredPart.createMany({
        data: dto.requiredParts.map((part) => ({
          songId: id,
          session: part.session,
          count: part.count,
        })),
      });
    });

    return this.findOne(id);
  }

  async remove(id: number, userId: number) {
    const song = await this.prisma.song.findUnique({
      where: { id },
      include: {
        votes: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!song) {
      throw new NotFoundException();
    }

    if (song.createdById !== userId) {
      throw new ForbiddenException('삭제 권한이 없습니다.');
    }

    if (song.votes.length > 0) {
      throw new BadRequestException('투표가 존재하는 곡은 삭제할 수 없습니다.');
    }

    await this.prisma.song.delete({
      where: { id },
    });

    return {
      message: '삭제되었습니다.',
    };
  }
}
