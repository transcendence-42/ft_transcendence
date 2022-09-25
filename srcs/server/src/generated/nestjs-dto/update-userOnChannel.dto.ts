import { UserRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateUserOnChannelDto {
  @ApiProperty({ enum: UserRole })
  @IsOptional()
  role?: UserRole;

  @IsOptional()
  @IsNumber()
  mutedTill?: Date;
  @IsOptional()
  @IsNumber()
  bannedTill: Date;
}
