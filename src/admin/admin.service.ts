import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { VoteTableDto } from './dto/vote-table.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getVoteTable(): Promise<VoteTableDto> {
    const [users, songs, votes] = await Promise.all([
      this.prisma.user.findMany({
        where: {
          id: {
            notIn: [1, 2],
          },
          primarySession: {
            not: 'VOCAL',
          },
        },
        select: {
          id: true,
          nickname: true,
          primarySession: true,
        },
        orderBy: {
          primarySession: 'asc',
        },
      }),

      this.prisma.song.findMany({
        select: {
          id: true,
          title: true,
          vocal: {
            select: {
              nickname: true,
            },
          },
          requiredParts: {
            select: {
              session: true,
              count: true,
            },
          },
        },
        orderBy: {
          title: 'asc',
        },
      }),

      this.prisma.vote.findMany({
        select: {
          userId: true,
          songId: true,
          rating: true,
          sessionDetail: true,
        },
      }),
    ]);

    const voteMap = new Map<
      string,
      { rating: number; sessionDetail: string | null }
    >();

    for (const vote of votes) {
      voteMap.set(`${vote.songId}-${vote.userId}`, {
        rating: vote.rating,
        sessionDetail: vote.sessionDetail,
      });
    }

    const songTable = songs.map((song) => {
      const songVotes: Record<
        number,
        { rating: number; sessionDetail: string | null }
      > = {};

      for (const user of users) {
        const vote = voteMap.get(`${song.id}-${user.id}`);

        if (vote) {
          songVotes[user.id] = vote;
        }
      }

      return {
        id: song.id,
        title: song.title,
        vocalNickname: song.vocal?.nickname,
        requiredParts: song.requiredParts,
        votes: songVotes,
      };
    });

    return {
      users,
      songs: songTable,
    };
  }
}
