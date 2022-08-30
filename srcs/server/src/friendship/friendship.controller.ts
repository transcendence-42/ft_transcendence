import { Controller, Delete, Body, Patch } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { BaseApiException } from 'src/common/exceptions/baseApiException.entity';
import { DeleteFriendshipDto } from './dto/delete-friendship.dto';
import { UpdateFriendshipDto } from './dto/update-friendship.dto';
import { Friendship } from './entities/friendship.entity';
import { FriendshipService } from './friendship.service';

@ApiTags('Friends')
@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  // FRIENDSHIP CRUD OPERATIONS ------------------------------------------------
  /** Delete a friendship */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a friendship' })
  @ApiOkResponse({
    description: 'Deleted user',
    type: Friendship,
    isArray: false,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: BaseApiException,
  })
  async remove(@Body() deleteFriendshipDto: DeleteFriendshipDto) {
    const res = await this.friendshipService.remove(deleteFriendshipDto);
    return res;
  }

  /** Update a friendship */
  @Patch(':id')
  @ApiOperation({ summary: 'Update a friendship' })
  @ApiOkResponse({
    description: 'Updated friendship',
    type: Friendship,
    isArray: false,
  })
  @ApiNotFoundResponse({
    description: 'Friendship not found',
    type: BaseApiException,
  })
  async update(@Body() updateFriendshipDto: UpdateFriendshipDto) {
    const res = await this.friendshipService.update(updateFriendshipDto);
    return res;
  }
}
