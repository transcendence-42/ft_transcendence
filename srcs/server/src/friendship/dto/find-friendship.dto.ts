import { PartialType } from '@nestjs/swagger';
import { DeleteFriendshipDto } from './delete-friendship.dto';

export class FindFriendshipDto extends PartialType(DeleteFriendshipDto) {}
