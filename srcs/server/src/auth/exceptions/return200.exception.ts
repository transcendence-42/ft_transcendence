import { HttpException, HttpStatus } from '@nestjs/common';

export class ReturnTwoHundredException extends HttpException {
  constructor(response?: string) {
    let responseMessage: string;
    const httpStatus: number = HttpStatus.OK;
    if (response === undefined) responseMessage = 'Bad credentials';
    else responseMessage = 'Bad credentials! ' + response;
    super(responseMessage, httpStatus);
  }
}
