import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class RequestFriendshipDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'id of the addressee', example: '15' })
  readonly addresseeId: number;
}
