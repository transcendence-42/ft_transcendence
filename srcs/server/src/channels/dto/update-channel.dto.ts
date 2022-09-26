import { ChannelType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateChannelDto {
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ enum: ChannelType })
  @IsEnum(ChannelType)
  @IsOptional()
  type?: ChannelType;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsNumber()
  ownerId?: number;
}
