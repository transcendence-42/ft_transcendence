import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class TwoFactorGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    console.debug('TwoFactorGuard in guard activatead');
    const request = context.switchToHttp().getRequest();
    const result = request.isAuthenticated();
    console.log(
      `This is user in TwoFactorGuard${JSON.stringify(request.user, null, 4)}`,
    );

    if (result) console.debug('TwoFactorGuard accepted user!');
    else console.debug('Guard TwoFactorGuard Rejected user!');
    return result;
  }
}
