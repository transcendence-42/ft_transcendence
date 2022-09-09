import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMatchDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'id of the first player in the match',
    example: '8',
  })
  readonly idPlayerLeft: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'id of the second player in the match',
    example: '15',
  })
  readonly idPlayerRight: number;
}
