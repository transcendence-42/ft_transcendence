import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LoggedInGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    console.log('Logged in guard activatead');
    const request = context.switchToHttp().getRequest();
    const result = request.isAuthenticated();
    if (result)
      console.log("Guard Accepeted user!")
    else
      console.log("Guard Rejected user!")
    // console.dir(request)
    console.log(`This is headers from request ${JSON.stringify(request.headers, null, 4)}`)
    return result;
  }
}
