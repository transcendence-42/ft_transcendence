import { HttpException, HttpStatus } from '@nestjs/common';

export class MatchAlreadyExistsException extends HttpException {
  constructor() {
    super(`The match you try to create already exists`, HttpStatus.CONFLICT);
  }
}

export class NoMatchesInDatabaseException extends HttpException {
  constructor() {
    super(`No matches in database`, HttpStatus.NO_CONTENT);
  }
}

export class MatchNotFoundException extends HttpException {
  constructor(id: number) {
    super(`Match #${id} not found`, HttpStatus.NOT_FOUND);
  }
}

export class MatchWithOnePlayerException extends HttpException {
  constructor() {
    super(
      `You can only create a match with two different players`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class PlayersNotAvailableException extends HttpException {
  constructor() {
    super(`At least one of the player is not available to play`, HttpStatus.OK);
  }
}
