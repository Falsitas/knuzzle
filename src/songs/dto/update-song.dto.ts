import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateSongRequiredPartDto } from './create-song-required-part.dto';
import { Type } from 'class-transformer';

export class UpdateSongDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  artist!: string;

  @IsOptional()
  @IsUrl()
  referenceUrl?: string;

  @IsInt()
  @Min(1)
  vocalId!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSongRequiredPartDto)
  requiredParts!: CreateSongRequiredPartDto[];
}
