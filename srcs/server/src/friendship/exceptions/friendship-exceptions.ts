import { HttpException, HttpStatus } from '@nestjs/common';
import { DeleteFriendshipDto } from '../dto/delete-friendship.dto';

export class FriendshipAlreadyExistsException extends HttpException {
  constructor(requester: number, addressee: number) {
    super(
      `User #${requester} is already friend with user #${addressee}`,
      HttpStatus.OK,
    );
  }
}

export class FriendshipRejectedException extends HttpException {
  constructor(requester: number, addressee: number) {
    super(
      `User #${addressee} has already refused to be friend with #${requester}`,
      HttpStatus.OK,
    );
  }
}

export class FriendshipRequestedException extends HttpException {
  constructor(requester: number, addressee: number) {
    super(
      `User #${addressee} has already requested to be friend with #${requester}`,
      HttpStatus.OK,
    );
  }
}

export class FriendshipNotFoundException extends HttpException {
  constructor(deleteUserDto: DeleteFriendshipDto) {
    super(
      `Friendship between #${deleteUserDto.requesterId} and #${deleteUserDto.addresseeId} not found`,
      HttpStatus.NOT_FOUND,
    );
  }
}
