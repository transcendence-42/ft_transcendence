import { Type } from 'class-transformer';
import { IsNumber, IsString, MaxLength, ValidateNested } from 'class-validator';
import { ChannelDto } from '../dto';

export class MessageDto {
  @IsString()
  @MaxLength(128)
  content: string;

  @IsNumber()
  date: number;

  @IsString()
  id: string;

  @ValidateNested()
  @Type(() => ChannelDto)
  channel: ChannelDto;
}
