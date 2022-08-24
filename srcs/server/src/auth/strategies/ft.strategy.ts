import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { VerifyFunction } from 'passport-local';
import { AuthService } from '../auth.service';
import { FtRegisterUserDto } from '../dto/registerUser.dto';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private authService: AuthService, config: ConfigService) {
    super({
      clientID: config.get('CLIENT_ID'),
      clientSecret: config.get('CLIENT_SECRET'),
      callbackURL: config.get('CALLBACK_URL'),
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyFunction) {
    const userInfo: FtRegisterUserDto = {
      email: profile.emails[0].value,
      username: profile.username,
      profile_image_url: profile.photos[0].value,
    };
    console.debug('Trying to validate user in FT Strat!');
    const [user, authMessage] = await this.authService.validateFtUser(userInfo);
    const authenticatedUser = {...user, authMessage};
    console.debug('this is new user' , authenticatedUser);
    if (!authenticatedUser) throw new UnauthorizedException('Invalid user!');
    return authenticatedUser;
  }
}
