import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { LocalLoginUserDto } from '../dto/login.dto';
import { User } from '@prisma/client';
import { BadCredentialsException } from '../exceptions';
import { RequestUser } from 'src/common/entities';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<RequestUser> {
    const payload: LocalLoginUserDto = { email: email, password: password };
    console.debug('User trying to log in: ', { payload });
    try {
      const user: RequestUser = await this.authService.validateLocalUser(payload);
      return user;
    } catch (err) {
      throw new UnauthorizedException('Bad credentials');
    }
  }
}
