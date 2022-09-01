import { HttpException, HttpStatus } from '@nestjs/common';

export class PlayersNotAvailableException extends HttpException {
  constructor() {
    super(`At least one of the player is not available to play`, HttpStatus.OK);
  }
}
