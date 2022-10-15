import {
  ExceptionFilter,
  UnauthorizedException,
  Catch,
  HttpException,
  ArgumentsHost,
  HttpStatus,
  ConsoleLogger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { InternalAuthException } from '../exceptions';

@Catch(UnauthorizedException, InternalAuthException)
export class FtExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const session = context.getRequest<Request>().session;
    const req = context.getRequest<Request>();
    console.log(`got an exception `);
    if (exception.getStatus() === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.log(
        `Being redirected on server error to path ${process.env.HOME_PAGE}`,
      );
      session?.destroy();
      response.clearCookie('auth_session', { path: '/' });
      response.redirect(process.env.LOGIN_PAGE);

    } else {
      console.log('reidrecting because aoatu42')
      response.setHeader(
        'Access-Control-Allow-Origin',
        process.env.WEBSITE_URL,
      );
      session?.destroy();
      response.clearCookie('auth_session', { path: '/' });
      response.redirect(process.env.LOGIN_PAGE);
    }
  }
}
