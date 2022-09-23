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

  @IsString()
  @IsNotEmpty()
  ownerId: string;

  @IsString()
  @IsOptional()
  password?: string;
}
