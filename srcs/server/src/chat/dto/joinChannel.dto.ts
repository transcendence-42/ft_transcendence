import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { eChannelType } from '../constants';

export class JoinChannelDto {
  @IsNotEmpty()
  @IsString()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(eChannelType)
  type: eChannelType;

  @IsNotEmpty()
  @IsString()
  userId: number;

  @IsOptional()
  @IsString()
  password?: string;
}
