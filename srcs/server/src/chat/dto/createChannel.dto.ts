import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { eChannelType } from '../constants';
import { ChannelUserDto } from './channelUserDto';

export class CreateChannelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(eChannelType)
  @IsNotEmpty()
  type: eChannelType;

  @IsNotEmpty()
  @ValidateNested({each: true})
  @Type(() => ChannelUserDto)
  users: ChannelUserDto[];

  @IsString()
  @IsOptional()
  password?: string;
}
