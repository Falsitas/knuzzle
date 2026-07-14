import { IsEnum, IsOptional } from 'class-validator';
import { Session } from '../../../generated/prisma/enums';

export class FindUsersDto {
  @IsOptional()
  @IsEnum(Session)
  primarySession?: Session;
}
