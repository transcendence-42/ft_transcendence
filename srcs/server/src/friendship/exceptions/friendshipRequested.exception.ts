import { HttpException, HttpStatus } from '@nestjs/common';

export class FriendshipRequestedException extends HttpException {
  constructor(requester: number, addressee: number) {
    super(
      `User #${requester} has already requested to be friend with #${addressee}`,
      HttpStatus.OK,
    );
  }
}
