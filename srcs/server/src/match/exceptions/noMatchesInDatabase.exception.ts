import { HttpException, HttpStatus } from '@nestjs/common';

export class NoMatchesInDatabaseException extends HttpException {
  constructor() {
    super(`No matches in database`, HttpStatus.NO_CONTENT);
  }
}
