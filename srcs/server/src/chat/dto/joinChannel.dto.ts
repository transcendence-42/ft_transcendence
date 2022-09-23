import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { eChannelType } from '../constants';

export class JoinChannelDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(eChannelType)
  type: eChannelType;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  password?: string;
}
