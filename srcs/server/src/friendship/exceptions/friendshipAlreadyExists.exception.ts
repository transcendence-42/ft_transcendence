import { HttpException, HttpStatus } from '@nestjs/common';

export class FriendshipAlreadyExistsException extends HttpException {
  constructor(requester: number, addressee: number) {
    super(
      `User #${requester} is already friend with user #${addressee}`,
      HttpStatus.OK,
    );
  }
}
