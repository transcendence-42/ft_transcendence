import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable()
export class Serialization extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }
  serializeUser(user: User, done: Function) {
    console.debug('\x1b[32m%s\x1b[0m', `serializing user ${JSON.stringify(user, null, 4)}`);
    return done(null, user);
  }

  async deserializeUser(user: User, done: Function) {
    const userDb = await this.userService.getUserByEmail(user.email);
    console.debug('\x1b[32m%s\x1b[0m', `deserializing user ${JSON.stringify(user, null, 4)}\nGot User ${JSON.stringify(userDb, null, 4)}`);
    if (!userDb) return done(null, null);
    return done(null, user);
  }
}
