import { Type } from 'class-transformer';
import { IsNotEmptyObject, IsNumber, IsString, MaxLength, ValidateNested } from 'class-validator';
import { Channel } from '../dto';

export class MessageDto {
  @IsString()
  @MaxLength(128)
  content: string;

  @IsNumber()
  date: number;

  @IsString()
  id: string;

  @IsNotEmptyObject()
  @ValidateNested()
  channel: { name: string; type: string; password?: string };
}
