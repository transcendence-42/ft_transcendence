import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RequestUser } from '../../common/entities/requestUser.entity';

@Injectable()
export class LoggedInGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    console.debug('Logged in guard activatead');
    const request = context.switchToHttp().getRequest();
    const result = request.isAuthenticated();
    console.debug(
      `This is user in LoggedInGuard ${JSON.stringify(request.user, null, 4)}`,
    );
    if (!result) {
      console.debug('Guard Rejected user because of isAuthenticated()!');
      // const res = context.switchToHttp().getResponse();
      // const session = request.session;
      // session?.destroy();
      // res.clearCookie('auth_session', { path: '/' });
      // res.redirect(process.env.LOGIN_PAGE);
      // throw new UnauthorizedException();
      return result;
    }
    return true;
  }
}
