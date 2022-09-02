import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateFriendshipDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'id of the requester', example: '8' })
  readonly requesterId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'id of the addressee', example: '15' })
  readonly addresseeId: number;
}
