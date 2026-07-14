import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

import { VoteType } from '../../../generated/prisma/enums';

export class CreateVoteDto {
  @IsInt()
  @Min(1)
  songId!: number;

  @IsOptional()
  @IsString()
  sessionDetail?: string;

  @IsEnum(VoteType)
  voteType!: VoteType;
}
