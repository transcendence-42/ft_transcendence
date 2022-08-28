import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FtAuthGuard extends AuthGuard('42') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.debug('\x1b[32m%s\x1b[0m', `FtAuthGuard activated.`);
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    console.debug(
      '\x1b[32m%s\x1b[0m',
      `This is reponse of the FtAuthGuard ${result}`,
    );
    return result;
  }
}
