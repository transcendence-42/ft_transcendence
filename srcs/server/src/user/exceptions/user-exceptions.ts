import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyExistsException extends HttpException {
  constructor(username: string) {
    super(`User "${username}" already exists`, HttpStatus.CONFLICT);
  }
}

export class NoUsersInDatabaseException extends HttpException {
  constructor() {
    super(`No users in database`, HttpStatus.NO_CONTENT);
  }
}

export class UserNotFoundException extends HttpException {
  constructor(id: number) {
    super(`User #${id} not found`, HttpStatus.NOT_FOUND);
  }
}
