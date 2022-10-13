import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InternalAuthException } from '../exceptions';

@Injectable()
export class FtAuthGuard extends AuthGuard('42') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const path = context.switchToHttp().getRequest().path;
    console.log(`This is the path ${JSON.stringify(path)}`);
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    console.log(`accepted user ? ${result}`);
    return result;
  }
  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (err || !user) {
      console.log(
        `Throwing an exception here because ${JSON.stringify(err)} and user ${
          user && JSON.stringify(user, null, 4)
        }`,
      );
      throw new InternalAuthException(
        'there was a problem with oauth2 authentication',
      );
    }
    return user;
  }
}
