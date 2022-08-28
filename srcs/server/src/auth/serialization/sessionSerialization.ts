import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { RequestUser } from '../../common/entities/requestUser.entity';

@Injectable()
export class Serialization extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }
  serializeUser(user: RequestUser, done: Function) {
    console.debug('\x1b[32m%s\x1b[0m', `serializing user ${JSON.stringify(user, null, 4)}`);
    return done(null, user);
  }

  async deserializeUser(user: RequestUser, done: Function) {
    const userDb = await this.userService.getUserByEmail(user.email);
    console.debug('\x1b[32m%s\x1b[0m', `deserializing user ${JSON.stringify(user, null, 4)}\nGot User ${JSON.stringify(userDb, null, 4)}`);
    if (!userDb) return done(null, null);
    return done(null, user);
  }
}
