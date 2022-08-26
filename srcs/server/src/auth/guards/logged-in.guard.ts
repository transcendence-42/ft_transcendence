import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class LoggedInGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    console.debug('Logged in guard activatead');
    const request = context.switchToHttp().getRequest();
    const result = request.isAuthenticated();
    console.log(`This is user in LoggedInGuard ${JSON.stringify(request.user, null, 4)}`)
    if (result)
      console.debug("Guard Accepeted user!")
    else
      console.debug("Guard Rejected user!")
    return result;
  }
}
