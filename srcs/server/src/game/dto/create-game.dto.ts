import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';

export class CreatePlayer {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'id of player', example: '8' })
  socketId: number;
}

export class CreateGameDto {
  @IsArray()
  @Type(() => CreatePlayer)
  @ValidateNested()
  @ApiProperty({
    description: 'players on the game',
    type: CreatePlayer,
    isArray: true,
  })
  readonly players: CreatePlayer[];
}
