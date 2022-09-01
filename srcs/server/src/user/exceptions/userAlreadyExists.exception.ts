import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyExistsException extends HttpException {
  constructor(username: string) {
    super(`User "${username}" already exists`, HttpStatus.CONFLICT);
  }
}
