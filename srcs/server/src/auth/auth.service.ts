import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import {
  FtRegisterUserDto,
  LocalRegisterUserDto,
} from './dto/registerUser.dto';
import { Credentials, User } from '@prisma/client';
import * as Bcrypt from 'bcryptjs';
import { UserLoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateFtUser(userInfo: FtRegisterUserDto): Promise<User> {
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

  async isUserRegisteredByOauth(username: string, email: string): Promise<boolean> {
    const foundUserEmail = await this.userService.getUserByEmail(email);
    if (foundUserEmail) return true;
    return false;
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

  async ftRegisteruser(userInfo: FtRegisterUserDto): Promise<User> {
    const user: User = await this.userService.createUserWithoutCredentials(userInfo);
    return user;
  }

  async validateUserCredentials(payload: UserLoginDto): Promise<User> {
    const userCredentials: Credentials | null =
      await this.userService.getUserCredentialsByEmail(payload.email);
    if (!userCredentials)
      throw new UnauthorizedException('Invalid email!');

    const validUser = await Bcrypt.compare(
      payload.password,
      userCredentials.password,
    );
    if (!validUser) throw new UnauthorizedException('Invalid password!');
    const user: User = await this.userService.getUserByEmail(payload.email);
    return user;
  }

  async localRegisterUser(
    userInfo: LocalRegisterUserDto,
  ): Promise<User> {
    // Check if the user already exists
    const userDb = await this.userService.getUserByEmail(userInfo.email);
    if (userDb) throw new UnauthorizedException('User already exists');

    // the strenght of the hashing
    const saltRounds: number = 10;
    const salt: string = await Bcrypt.genSalt(saltRounds);
    const hash: string = await Bcrypt.hash(userInfo.password, salt);

    const createdUser = await this.userService.createUserWithCredentials(
      userInfo,
      hash,
    );
    console.log(`User doesn't exist:${createdUser.email}|`);
    return createdUser;
  }
}
