import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

import { Session, VoteType } from '../../../generated/prisma/enums';

export class CreateVoteDto {
  @IsInt()
  @Min(1)
  songId: number;

  @IsEnum(Session)
  session: Session;

  @IsOptional()
  @IsString()
  sessionDetail?: string;

  @IsEnum(VoteType)
  voteType: VoteType;
}
