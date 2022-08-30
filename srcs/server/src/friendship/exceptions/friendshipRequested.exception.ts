import { HttpException, HttpStatus } from '@nestjs/common';

export class FriendshipRequestedException extends HttpException {
  constructor(requester: number, addressee: number) {
    super(
      `User #${addressee} has already requested to be friend with #${requester}`,
      HttpStatus.OK,
    );
  }
}
