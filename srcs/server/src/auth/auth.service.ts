import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import {
  FtRegisterUserDto,
  LocalRegisterUserDto,
} from './dto/registerUser.dto';
import { Credentials, User } from '@prisma/client';
import * as Bcrypt from 'bcrypt';
import { UserLoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateFtUser(userInfo: FtRegisterUserDto): Promise<User | null> {
    /* this functions goal is to check whether a user has already registered
     * using a local authentication method (email + password)
     * if user exists in Credentials table it means that a user has already registered
     * with this email using local authentification and thus we should deny access
     * if the user is not registered we create a new account else we just log the user in
     */
    const emailAndUsernameTaken = await this.isUserRegisteredByCredentials(userInfo.email, userInfo.username);
    if (emailAndUsernameTaken) return null;

    const userAlreadyRegistered = await this.userService.getUserByEmail(userInfo.email);
    if (userAlreadyRegistered)
      return userAlreadyRegistered;
    const user = await this.ftRegisteruser(userInfo);
    return user;
  }

  async isUserRegisteredByOauth(username: string, email: string) {
    const foundUserEmail = await this.userService.getUserByEmail(email);
    if (foundUserEmail) return true;
  }

  async isUserRegisteredByCredentials(
    username: string,
    email: string,
  ): Promise<boolean> {
    const foundUserEmail = await this.userService.getUserCredentialsByEmail(
      email,
    );
    if (foundUserEmail) return true;

    const foundUserName = await this.userService.getUserCredentialsByUsername(
      username,
    );
    if (foundUserName) return true;

    return false;
  }

  async ftRegisteruser(userInfo: FtRegisterUserDto): Promise<User | null> {
    const user = this.userService.createUserWithoutCredentials(userInfo);
    return user;
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

  async localRegisterUser(
    userInfo: LocalRegisterUserDto,
  ): Promise<User | null> {
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
    const createdUser = await this.userService.createUserWithCredentials(
      newUser,
      hash,
    );
    console.log('Created a new user!');
    return createdUser;
  }
}
