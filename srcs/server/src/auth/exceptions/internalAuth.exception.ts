import { HttpException, HttpStatus } from '@nestjs/common';

export class InternalAuthException extends HttpException {
  constructor(response?: string) {
    let responseMessage: string;
    const httpStatus: number = HttpStatus.INTERNAL_SERVER_ERROR;
    if (response === undefined) responseMessage = 'error';
    else responseMessage = response;
    super(responseMessage, httpStatus);
  }
}
