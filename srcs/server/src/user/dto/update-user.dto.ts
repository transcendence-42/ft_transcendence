import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CreateUserDto } from './create-user.dto';

enum UserStatus {
  AWAY,
  HERE,
  PLAYING,
}

export class UpdateStatsDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'number of wins of a player',
    example: '8',
  })
  wins?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'number of losses of a player',
    example: '2',
  })
  losses?: number;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'status of the user : 0=away, 1=here, 2=playing',
    example: '1',
  })
  readonly currentStatus?: UserStatus;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'current rank of the user', example: '38' })
  readonly currentRank?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'current elo rating of the user',
    example: '1550',
  })
  readonly eloRating?: number;

  @IsObject()
  @IsOptional()
  @Type(() => UpdateStatsDto)
  @ValidateNested()
  @ApiProperty({
    description: 'stats of the player',
    type: UpdateStatsDto,
    isArray: false,
  })
  readonly stats?: UpdateStatsDto;
}
