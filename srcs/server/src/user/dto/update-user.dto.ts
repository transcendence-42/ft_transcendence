import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

enum UserStatus {
  AWAY,
  HERE,
  PLAYING,
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
}
