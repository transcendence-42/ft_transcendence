import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UserLoginDto } from '../dto/login.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string) {
    const payload: UserLoginDto = { email: email, password: password };
    const user = await this.authService.validateUserCredentials(payload);
    if (!user)
      throw new UnauthorizedException('Invalid Credentials from user!');
    return user;
  }
}
