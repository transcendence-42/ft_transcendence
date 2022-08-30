import { HttpException, HttpStatus } from '@nestjs/common';

export class MatchAlreadyExistsException extends HttpException {
  constructor() {
    super(`The match you try to create already exists`, HttpStatus.CONFLICT);
  }
}
