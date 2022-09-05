import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateGameDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'room id', example: 'game-xxxxx' })
  readonly id: string;

  @IsNumber()
  @ApiProperty({ description: 'move of the user : 0=up, 1=down', example: '0' })
  readonly move?: number;
}
