import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

export class Client {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'socket id of player' })
  socketId: string;
}

export class AddPlayer {
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @ApiProperty({
    description: 'add a player to the game',
    type: AddPlayer,
    isArray: false,
  })
  add: Client;
}

export class AddViewer {
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @ApiProperty({
    description: 'add a viewer to the game',
    type: AddViewer,
    isArray: false,
  })
  add: Client;
}

export class UpdateGameDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'room id to update', example: 'userXXgame' })
  readonly roomId: string;

  @IsNumber()
  @ApiProperty({ description: 'user id of player', example: '88' })
  readonly playerId?: number;

  @IsNumber()
  @ApiProperty({ description: 'move of the user : 0=up, 1=down', example: '0' })
  readonly move?: number;

  @Type(() => AddPlayer)
  @ValidateNested()
  @ApiProperty({
    description: 'playes of the game',
    type: AddPlayer,
    isArray: false,
  })
  readonly players?: AddPlayer;

  @Type(() => AddViewer)
  @ValidateNested()
  @ApiProperty({
    description: 'viewers of the game',
    type: AddViewer,
    isArray: false,
  })
  readonly viewers?: AddViewer;
}
