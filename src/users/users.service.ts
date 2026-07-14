import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Session } from 'generated/prisma/enums';
import { FindUsersDto } from './dto/find-users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: FindUsersDto) {
    return this.prisma.user.findMany({
      orderBy: {
        id: 'asc',
      },
      where: {
        ...(query.primarySession && {
          primarySession: query.primarySession,
        }),
      },
    });
  }

  async updatePrimarySession(userId: number, session: Session) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        primarySession: session,
      },
    });
  }

  async findMe(userId: number) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        role: true,
        primarySession: true,
      },
    });
  }
}
