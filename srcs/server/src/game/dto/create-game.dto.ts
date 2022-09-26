import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';

export class CreatePlayerDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'id of player', example: '8' })
  socketId: number;
}

export class CreateGameDto {
  @IsArray()
  @Type(() => CreatePlayerDto)
  @ValidateNested()
  @ApiProperty({
    description: 'players on the game',
    type: CreatePlayerDto,
    isArray: true,
  })
  readonly players: CreatePlayerDto[];
}
