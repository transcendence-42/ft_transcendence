import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class Client {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'socket id of client' })
  socketId: string;
}

export class UpdateGameDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'room id to update', example: 'userXXgame' })
  readonly id: string;

  @IsString()
  @ApiProperty({ description: 'user id of player', example: '88' })
  readonly playerId?: string;

  @IsNumber()
  @ApiProperty({ description: 'move of the user : 0=up, 1=down', example: '0' })
  readonly move?: number;

  @Type(() => Client)
  @ValidateNested()
  @ApiProperty({
    description: 'add a player to the game',
    type: Client,
    isArray: false,
  })
  readonly player?: Client;

  @Type(() => Client)
  @ValidateNested()
  @ApiProperty({
    description: 'add a viewer to the game',
    type: Client,
    isArray: false,
  })
  readonly viewer?: Client;
}
