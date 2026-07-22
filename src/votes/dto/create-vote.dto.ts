import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateVoteDto {
  @IsInt()
  @Min(1)
  songId!: number;

  @IsOptional()
  @IsString()
  sessionDetail?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;
}
