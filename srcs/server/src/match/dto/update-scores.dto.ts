import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

class UpdatePlayersOnMatchDto {
  @IsNumber()
  @ApiProperty({
    description: 'id of player',
    example: '8',
  })
  playerId: number;

  @IsNumber()
  @ApiProperty({
    description: 'score of player',
    example: '2',
  })
  playerScore: number;
}

export class UpdateScoresDto {
  @IsNumber()
  @ApiProperty({
    description: 'players on the match',
    example: '2',
    type: UpdatePlayersOnMatchDto,
  })
  readonly players: UpdatePlayersOnMatchDto[];
}
