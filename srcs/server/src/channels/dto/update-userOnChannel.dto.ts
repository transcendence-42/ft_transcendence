import { UserRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsOptional } from 'class-validator';

export class UpdateUserOnChannelDto {
  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsDate()
  @IsOptional()
  mutedTill?: Date;

  @IsDate()
  @IsOptional()
  bannedTill?: Date;
}
