import { HttpException, HttpStatus } from '@nestjs/common';

export class NotEnoughPlayersException extends HttpException {
  constructor() {
    super(
      `You need at least 2 players to create a match`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
