import { HttpException, HttpStatus } from '@nestjs/common';

export class NoUsersInDatabaseException extends HttpException {
  constructor() {
    super(`No users in database`, HttpStatus.NO_CONTENT);
  }
}
