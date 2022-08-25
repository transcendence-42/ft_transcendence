import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import {
  FtRegisterUserDto,
  LocalRegisterUserDto,
} from './dto/registerUser.dto';
import { Credentials, User } from '@prisma/client';
import * as Bcrypt from 'bcryptjs';
import { UserLoginDto } from './dto/login.dto';
import { BadCredentialsException, userAlreadyRegistered } from './exceptions';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly config: ConfigService,
  ) {}
  private readonly LOGIN_PAGE: string = this.config.get('LOGIN_PAGE');
  private readonly HOME_PAGE: string = this.config.get('HOME_PAGE');

  async validateFtUser(userInfo: FtRegisterUserDto): Promise<[User, string]> {
    /* this functions goal is to check whether a user has already registered
     * using a local authentication method (email + password)
     * if user exists in Credentials table it means that a user has already registered
     * with his email using local authentification and thus we should deny access
     * if the user is not registered we create a new account else we just log the user in
     */
    const emailAndUsernameTaken = await this.isUserRegisteredByCredentials(
      userInfo.email,
      userInfo.username,
    );
    if (emailAndUsernameTaken) return [null, 'Credentials taken'];

    const userAlreadyRegistered = await this.userService.getUserByEmail(
      userInfo.email,
    );
    if (userAlreadyRegistered) return [userAlreadyRegistered, 'Logged in'];
    const user = await this.ftRegisteruser(userInfo);
    return [user, 'Registered'];
  }

  async isUserRegisteredByCredentials(
    username: string,
    email: string,
  ): Promise<boolean> {
    /* Checks if the user registered using credentials (username, email and password) */
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
    /* creates a user using the information from FortyTwo Oauth2 flow
     * this means that the user doesn't get a credentials table in the database
     */

    const user: User = await this.userService.createUserWithoutCredentials(
      userInfo,
    );
    return user;
  }

  handleFtRedirect(res) {
    return res.redirect(this.HOME_PAGE);
  }

  handleSuccessLogin(req, res) {
    if (req.user) {
      res.json({
        success: true,
        message: 'user has successfully authenticated',
        user: req.user,
        cookies: req.cookies,
      });
      return req.user;
    } else return `Bad user. Status = ${res.status}`;
  }

  handleLocalLogin(req, res) {
    return res.redirect(this.HOME_PAGE);
  }

  handleLocalRegister(payload: LocalRegisterUserDto, res) {
    const user = this.localRegisterUser(payload);
    if (user) return res.redirect(this.HOME_PAGE);
    else return res.redirect(this.LOGIN_PAGE);
  }

  async validateUserCredentials(payload: UserLoginDto): Promise<User> {
    const userCredentials: Credentials | null =
      await this.userService.getUserCredentialsByEmail(payload.email);
    if (!userCredentials) throw new BadCredentialsException('Invalid email!');

    const validUser: boolean = await Bcrypt.compare(
      payload.password,
      userCredentials.password,
    );
    if (!validUser) throw new BadCredentialsException('Invalid password!');
    const user: User = await this.userService.getUserByEmail(payload.email);
    return user;
  }

  async localRegisterUser(userInfo: LocalRegisterUserDto): Promise<User> {
    /* Check if the user already exists */
    const userDb = await this.userService.getUserByEmail(userInfo.email);
    if (userDb) throw new userAlreadyRegistered();

    /* the strenght of the hashing algorithm */
    const saltRounds: number = 10;
    const salt: string = await Bcrypt.genSalt(saltRounds);
    const hash: string = await Bcrypt.hash(userInfo.password, salt);

    const createdUser = await this.userService.createUserWithCredentials(
      userInfo,
      hash,
    );
    return createdUser;
  }
}
