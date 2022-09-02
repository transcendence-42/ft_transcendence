import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMatchDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'id of the first player in the match',
    example: '8',
  })
  readonly idPlayer1: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'id of the second player in the match',
    example: '15',
  })
  readonly idPlayer2: number;
}
