import { HttpException, HttpStatus } from '@nestjs/common';

export class FriendshipAlreadyExistsException extends HttpException {
  constructor(requester: number, addressee: number) {
    super(
      `User #${requester} is already friend with user #${addressee}`,
      HttpStatus.CONFLICT,
    );
  }
}

export class FriendshipRejectedException extends HttpException {
  constructor(requester: number, addressee: number) {
    super(
      `User #${addressee} has already refused to be friend with #${requester}`,
      HttpStatus.NOT_MODIFIED,
    );
  }
}

export class UserNotFoundException extends HttpException {
  constructor(id: number) {
    super(`User #${id} not found`, HttpStatus.NOT_FOUND);
  }
}
