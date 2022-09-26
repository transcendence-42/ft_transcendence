import { UserRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class UpdateUserOnChannelDto {
  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  role?: UserRole;
}
