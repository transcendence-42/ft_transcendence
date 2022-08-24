import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
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
  async validate(accessToken: string, refreshToken: string, profile: any) {
    const userInfo: FtRegisterUserDto = {
      email: profile.emails[0].value,
      username: profile.username,
      profile_image_url: profile.photos[0].value,
    };
    console.log('Trying to validate user in FT Strat!');
    const user = await this.authService.validateFtUser(userInfo);
    if (user)
      console.log(`validated user ${JSON.stringify(user, null, 4)}`);
    else
      console.log('failed to validate!');
    if (!user) throw new UnauthorizedException('Invalid user!');
    return user;
  }
}
