import { HttpException, HttpStatus } from '@nestjs/common';

export class FriendshipNotFoundException extends HttpException {
  constructor(requester: number, addressee: number) {
    super(
      `Friendship between #${requester} and #${addressee} not found`,
      HttpStatus.NOT_FOUND,
    );
  }
}
