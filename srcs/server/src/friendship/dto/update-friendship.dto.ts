import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { DeleteFriendshipDto } from './delete-friendship.dto';

export class UpdateFriendshipDto extends DeleteFriendshipDto {
  @IsNumber()
  @ApiProperty({
    description:
      'status of the friendship: 0=requested, 1=accepted, 2=rejected',
    example: '2',
  })
  readonly status: number;
}
