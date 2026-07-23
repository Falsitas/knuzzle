import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { Role } from '../../../generated/prisma/client';

export interface RequestWithUser extends Request {
  user: {
    id: number;
    nickname: string;
    role: Role;
  };
}

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const user = request.user;

    if (!user) {
      return false;
    }

    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('관리자만 접근할 수 있습니다.');
    }

    return true;
  }
}
