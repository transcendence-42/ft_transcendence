import { HttpException, HttpStatus } from '@nestjs/common';

export class ChannelAlreadyExistsException extends HttpException {
  constructor(name: string) {
    super(`Channel "${name}" already exists`, 204);
  }
}
