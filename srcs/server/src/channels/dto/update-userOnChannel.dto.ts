import { UserRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean,IsEnum, IsOptional } from 'class-validator';

export class UpdateUserOnChannelDto {
  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsBoolean()
  @IsOptional()
  isMuted?: boolean;

  @IsBoolean()
  @IsOptional()
  isBanned?: boolean;

  @IsBoolean()
  @IsOptional()
  hasLeftTheChannel?: boolean;
}
