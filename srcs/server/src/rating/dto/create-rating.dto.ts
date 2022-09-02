import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateRatingDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'id of the user', example: '15' })
  readonly userId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'rating of the user', example: '1550' })
  readonly rating: number;
}
