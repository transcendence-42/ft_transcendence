import { HttpException, HttpStatus } from '@nestjs/common';

export class MatchNotFoundException extends HttpException {
  constructor(id: number) {
    super(`Match #${id} not found`, HttpStatus.NOT_FOUND);
  }
}
