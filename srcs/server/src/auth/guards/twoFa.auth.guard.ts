import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

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
    if (request.user.isTwoFactorActivated)
      throw new UnauthorizedException(
        '2FA is already activated!' +
          'Deactivate it before attempting to generate a new code',
      );
    if (request.user.isTwoFactorAuthenticated)
      throw new UnauthorizedException('User is already 2FA authenticated!');
    return result;
  }
}
