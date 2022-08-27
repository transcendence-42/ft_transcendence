import { Controller, Delete, Body } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { BaseApiException } from 'src/common/exceptions/baseApiException.entity';
import { DeleteFriendshipDto } from './dto/delete-friendship.dto';
import { Friendship } from './entities/friendship.entity';
import { FriendshipService } from './friendship.service';

@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @ApiTags('Friends')
  @Delete(':id')
  @ApiOperation({ summary: 'delete a friendship' })
  @ApiOkResponse({
    description: 'Deleted user',
    type: Friendship,
    isArray: false,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: BaseApiException,
  })
  remove(@Body() deleteUserDto: DeleteFriendshipDto) {
    return this.friendshipService.remove(deleteUserDto);
  }
}
