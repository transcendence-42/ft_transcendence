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
      //   profileFields: {
      //     id: function (obj) {
      //       return String(obj.id);
      //     },
      //     username: 'login',
      //     'emails.0.value': 'email',
      //     'photos.0.value': 'image_url',
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: any) {
    const userInfo: FtRegisterUserDto = {
      email: profile.emails[0].value,
      username: profile.username,
      profile_image_url: profile.photos[0].value,
    };
    const user = await this.authService.validateFtUser(userInfo);
    if (!user) throw new UnauthorizedException('Invalid user!');
    return user;
  }
}
