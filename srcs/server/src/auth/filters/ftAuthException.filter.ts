import {
  ExceptionFilter,
  UnauthorizedException,
  Catch,
  HttpException,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { InternalAuthException } from '../exceptions';

@Catch(UnauthorizedException, InternalAuthException)
export class FtExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    if (exception.getStatus() === HttpStatus.INTERNAL_SERVER_ERROR) {
      response.redirect(process.env.ERROR_PAGE);
    } else {
      response.redirect(process.env.LOGIN_PAGE);
    }
  }
}
