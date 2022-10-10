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
    return done(null, user);
  }

  async deserializeUser(user: RequestUser, done: Function) {
    console.log(`Trying to deserialize user ${JSON.stringify(user)}`)
    const userDb = await this.userService.getUserByEmail(user.email);
    if (!userDb) return done(null, null);
    return done(null, user);
  }
}
