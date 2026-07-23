import { Session } from 'generated/prisma/enums';

export class VoteTableUserDto {
  id!: number;
  nickname!: string;
  primarySession!: Session | null;
}

export class RequiredPartDto {
  session!: Session;
  count!: number;
}

export class VoteInfoDto {
  rating!: number;
  sessionDetail!: string | null;
}

export class VoteTableSongDto {
  id!: number;
  title!: string;
  vocalNickname!: string;
  requiredParts!: RequiredPartDto[];
  votes!: Record<number, VoteInfoDto>;
}

export class VoteTableDto {
  users!: VoteTableUserDto[];
  songs!: VoteTableSongDto[];
}
