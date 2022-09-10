import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';

enum PlayerSide {
  LEFT = 0,
  RIGHT,
}

enum PlayerStatus {
  WIN,
  LOSE,
  ABANDON,
}

class CreatePlayersOnMatchDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'id of player',
    example: '8',
  })
  playerId: number;

  @IsNumber()
  @ApiProperty({
    description: 'side of player : 0=Left, 1=Right',
    example: '0',
  })
  side?: PlayerSide;

  @IsNumber()
  @ApiProperty({
    description: 'score of player',
    example: '2',
  })
  score?: number;

  @IsNumber()
  @ApiProperty({
    description: 'status of player : 0=Lose, 1=Win, 2=Abandon',
    example: '2',
  })
  status?: PlayerStatus;
}

export class CreateMatchDto {
  @IsArray()
  @Type(() => CreatePlayersOnMatchDto)
  @ValidateNested()
  @ApiProperty({
    description: 'players on the match',
    type: CreatePlayersOnMatchDto,
    isArray: true,
  })
  readonly players: CreatePlayersOnMatchDto[];
}
