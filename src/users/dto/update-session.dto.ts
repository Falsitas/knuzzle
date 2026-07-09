import { IsEnum } from 'class-validator';
import { Session } from '../../../generated/prisma/enums';

export class UpdateSessionDto {
  @IsEnum(Session)
  session!: Session;
}
