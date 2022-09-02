import { HttpException, HttpStatus } from '@nestjs/common';

export class FriendshipRejectedException extends HttpException {
  constructor(requester: number, addressee: number) {
    super(
      `User #${addressee} has already refused to be friend with #${requester}`,
      HttpStatus.OK,
    );
  }
}
