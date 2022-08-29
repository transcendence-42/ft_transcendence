import { HttpException, HttpStatus } from '@nestjs/common';

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
  constructor(requester: number, addressee: number) {
    super(
      `Friendship between #${requester} and #${addressee} not found`,
      HttpStatus.NOT_FOUND,
    );
  }
}
