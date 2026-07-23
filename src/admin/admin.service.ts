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
        },
        select: {
          id: true,
          nickname: true,
        },
        orderBy: {
          nickname: 'asc',
        },
      }),

      this.prisma.song.findMany({
        select: {
          id: true,
          title: true,
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
        },
      }),
    ]);

    const voteMap = new Map<string, number>();

    for (const vote of votes) {
      voteMap.set(`${vote.songId}-${vote.userId}`, vote.rating);
    }

    const songTable = songs.map((song) => {
      const songVotes: Record<number, number> = {};

      for (const user of users) {
        const rating = voteMap.get(`${song.id}-${user.id}`);

        if (rating !== undefined) {
          songVotes[user.id] = rating;
        }
      }

      return {
        id: song.id,
        title: song.title,
        votes: songVotes,
      };
    });

    return {
      users,
      songs: songTable,
    };
  }
}
