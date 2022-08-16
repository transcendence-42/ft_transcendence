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
    return done(null, user);
  }

  async deserializeUser(user: User, done: Function) {
    const userDb = await this.userService.getUserByEmail(user.email);
    if (!userDb) return done(null, null);
    return done(null, user);
  }
}
