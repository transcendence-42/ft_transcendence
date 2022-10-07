import { HttpException, HttpStatus } from '@nestjs/common';

export class ChannelNotFoundException extends HttpException {
  constructor(id: number) {
    super(`Channel #${id} not found`, HttpStatus.NOT_FOUND);
  }
}
