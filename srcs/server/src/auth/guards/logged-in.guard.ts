import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
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
      console.debug('Guard Rejected user because of isAutehnticated()!');
      return result;
    }
    const user: RequestUser = request.user;
    if (
      user.isTwoFactorActivated === true &&
      user.isTwoFactorAuthenticated === false
    ) {
      console.debug('Guard Rejected user! because of isTwoFactorAuthenticated');
      return false;
    }
    console.debug('Guard Accepeted user!');
    return true;
  }
}
