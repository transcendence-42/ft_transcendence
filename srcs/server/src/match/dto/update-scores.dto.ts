import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';

export class UpdatePlayersOnMatchDto {
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
  @IsArray()
  @Type(() => UpdatePlayersOnMatchDto)
  @ValidateNested()
  @ApiProperty({
    description: 'players on the match',
    type: UpdatePlayersOnMatchDto,
    isArray: true,
  })
  readonly players: UpdatePlayersOnMatchDto[];
}
