export class VoteTableUserDto {
  id!: number;
  nickname!: string;
}

export class VoteTableSongDto {
  id!: number;
  title!: string;
  votes!: Record<number, number>;
}

export class VoteTableDto {
  users!: VoteTableUserDto[];
  songs!: VoteTableSongDto[];
}
