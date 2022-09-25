import { UserRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUserOnChannelDto {
  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @IsNumber()
  @IsNotEmpty()
  channelId: number;
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
