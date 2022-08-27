import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { VerifyFunction } from 'passport-local';
import { AuthService } from '../auth.service';
import { FtRegisterUserDto } from '../dto/registerUser.dto';
import { BadCredentialsException } from '../exceptions';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private authService: AuthService, config: ConfigService) {
    super({
      clientID: config.get('CLIENT_ID'),
      clientSecret: config.get('CLIENT_SECRET'),
      callbackURL: config.get('CALLBACK_URL'),
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: any) {
    const userInfo: FtRegisterUserDto = {
      email: profile.emails[0].value,
      username: profile.username,
      profile_image_url: profile.photos[0].value,
    };
    console.debug('Trying to validate user in FT Strat!');
    const [user, authMessage] = await this.authService.validateFtUser(userInfo);
    const isTwoFactorAuthenticated = false;
    const isTwoFactorActivated = user.two_fa_activated
    const authenticatedUser = { ...user, authMessage, isTwoFactorAuthenticated, isTwoFactorActivated};
    delete authenticatedUser.two_fa_activated;
    console.debug('this is user', authenticatedUser);
    if (!authenticatedUser) throw new BadCredentialsException();
    return authenticatedUser;
  }
}
