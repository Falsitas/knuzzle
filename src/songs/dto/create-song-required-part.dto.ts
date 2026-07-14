import { IsEnum, IsInt, Min } from 'class-validator';
import { Session } from 'generated/prisma/enums';

export class CreateSongRequiredPartDto {
  @IsEnum(Session)
  session!: Session;

  @IsInt()
  @Min(0)
  count!: number;
}
