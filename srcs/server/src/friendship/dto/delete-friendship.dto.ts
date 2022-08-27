import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteFriendshipDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'id of the requester', example: '5' })
  readonly requesterId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'id of the addressee', example: '8' })
  readonly addresseeId: number;
}
