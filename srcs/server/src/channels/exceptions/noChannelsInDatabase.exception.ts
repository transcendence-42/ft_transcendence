import { HttpException, HttpStatus } from '@nestjs/common';

export class NoChannelsInDatabaseException extends HttpException {
  constructor() {
    super(`No channels in database`, HttpStatus.NO_CONTENT);
  }
}