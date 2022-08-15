import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { AuthService } from '../auth.service';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, 'passport-42') {
  constructor(private authService: AuthService, config: ConfigService) {
    super({
      clientID: config.get('CLIENT_ID'),
      clientSecret: config.get('CLIENT_SECRET'),
      callbackURL: 'http://localhost:3333/auth/42/redirect/',
      //   profileFields: {
      //     id: function (obj) {
      //       return String(obj.id);
      //     },
      //     username: 'login',
      //     'emails.0.value': 'email',
      //     'photos.0.value': 'image_url',
      //   },
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: any) {
    const user = this.authService.validateFtUser(profile);
    console.log('User inside validate', user);
    if (!user) throw new UnauthorizedException('Invalid user!');
    return user;
  }
}
