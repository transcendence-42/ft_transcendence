import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UserLoginDto } from '../dto/login.dto';
import { User } from '@prisma/client';
import { BadCredentialsException } from '../exceptions';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<User> {
    const payload: UserLoginDto = { email: email, password: password };
    console.debug('User trying to log in: ', { payload });
    const user = await this.authService.validateUserCredentials(payload);
    console.debug('Trying to get the correct credentials', {user});
    if (!user)
      throw new BadCredentialsException();
    return user;
  }
}
