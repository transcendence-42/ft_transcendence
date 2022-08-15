import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { Credentials, User } from '@prisma/client';
import * as Bcrypt from 'bcrypt';
import { UserLoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateFtUser(profile) {
    return profile;
  }

  async validateUserCredentials(payload: UserLoginDto): Promise<User | null> {
    const userCredentials: Credentials | null =
      await this.userService.getUserCredentialsByEmail(payload.email);
    if (!userCredentials)
      throw new UnauthorizedException('User doesn\t exist or false email');

    const validUser = await Bcrypt.compare(
      payload.password,
      userCredentials.password,
    );
    if (!validUser) throw new UnauthorizedException('Invalid Password!');
    const user: User = await this.userService.getUserByEmail(payload.email);
    return user;
  }

  async registerUser(userInfo: RegisterUserDto): Promise<User | null> {
    // Check if the user already exists
    const userDb = await this.userService.getUserByEmail(userInfo.email);
    if (userDb) throw new UnauthorizedException('User already exists');

    // the strenght of the hashing
    const saltRounds: number = 10;
    const salt: string = await Bcrypt.genSalt(saltRounds);
    const hash: string = await Bcrypt.hash(userInfo.password, salt);

    const newUser: User = {
      email: userInfo.email,
      username: userInfo.username,
      id: null,
      created_at: null,
      profile_picture: null,
    };
    const createdUser = await this.userService.createUser(newUser, hash);
    console.log('Created a new user!');
    return createdUser;
  }
}
