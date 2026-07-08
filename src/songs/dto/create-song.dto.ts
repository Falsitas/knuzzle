import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class CreateSongDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  artist: string;

  @IsOptional()
  @IsUrl()
  referenceUrl?: string;

  @IsInt()
  @Min(1)
  vocalId: number;
}
