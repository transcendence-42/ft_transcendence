import { HttpException, HttpStatus } from '@nestjs/common';

export class MatchWithOnePlayerException extends HttpException {
  constructor() {
    super(
      `You can only create a match with two different players`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
