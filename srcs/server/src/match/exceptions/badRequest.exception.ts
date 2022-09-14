import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequestException extends HttpException {
  constructor() {
    super(`The request payload is not as expected`, HttpStatus.BAD_REQUEST);
  }
}
