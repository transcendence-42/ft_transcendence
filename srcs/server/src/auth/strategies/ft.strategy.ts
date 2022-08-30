import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { AuthService } from '../auth.service';
import { FtRegisterUserDto } from '../dto/registerUser.dto';
import { RequestUser } from '../../common/entities/requestUser.entity';

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
      profileImageUrl: profile.photos[0].value,
    };
    console.debug('Trying to validate user in FT Strat!');
    const user: RequestUser = await this.authService.validateFtUser(userInfo);
    console.debug(
      `Validated user inside Ft Strategy ${JSON.stringify(user, null, 4)}`,
    );
    return user;
  }
}
