import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class LoggedInGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    console.debug('Logged in guard activatead');
    const request = context.switchToHttp().getRequest();
    const result = request.isAuthenticated();
    if (result)
      console.debug("Guard Accepeted user!")
    else
      console.debug("Guard Rejected user!")
    console.debug(`This is headers from request ${JSON.stringify(request.headers, null, 4)}`)
    return result;
  }
}
