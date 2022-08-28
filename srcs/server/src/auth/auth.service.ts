import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import {
  FtRegisterUserDto,
  LocalRegisterUserDto,
} from './dto/registerUser.dto';
import { Credentials, User } from '@prisma/client';
import * as Bcrypt from 'bcryptjs';
import { UserLoginDto } from './dto/login.dto';
import {
  BadCredentialsException,
  userAlreadyRegisteredException,
  CredentialsTakenException,
} from './exceptions';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { RequestUser } from '../common/entities/requestUser.entity';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly config: ConfigService,
  ) {}
  private readonly LOGIN_PAGE: string = this.config.get('LOGIN_PAGE');
  private readonly HOME_PAGE: string = this.config.get('HOME_PAGE');

  /******************************* 42 Oauth2 Flow ******************************/

  handleFtRedirect(user: RequestUser, res: Response) {
    if (
      user.isTwoFactorActivated === true &&
      user.isTwoFactorAuthenticated === false
    ) {
      console.debug(`redirecting to 2fa`);
      res.redirect('http://127.0.0.1:3042/2fa');
    } else {
      console.debug(`redirecting to Home`);
      return res.redirect(this.HOME_PAGE);
    }
  }

  async validateFtUser(userInfo: FtRegisterUserDto): Promise<RequestUser> {
    /* this function validates the user by doing two things:
     * 1- Checks whether the user already has an account
     * using the local authentication method. If so, it throws and exception.
     * 2- Creates a new user if the user is not registered
     * returns an object containing a RequestUser and a message to specify if the user
     * logged in or signed up
     */
    const credentialsByEmail: Credentials =
      await this.userService.getUserCredentialsByEmail(userInfo.email);
    if (credentialsByEmail !== null && credentialsByEmail.password !== null)
      throw new CredentialsTakenException();
    const credentialsByUsername: Credentials =
      await this.userService.getUserCredentialsByUsername(userInfo.username);
    if (
      credentialsByUsername !== null &&
      credentialsByUsername.password !== null
    )
      throw new CredentialsTakenException();

    /* this means that the user doesn't have an account
     * (we checked if the email and username exist and we didn't find any)
     * so we need to create one
     */
    if (credentialsByEmail === null && credentialsByUsername === null) {
      const createdUser = await this.ftRegisterUser(userInfo);
      const user: RequestUser = this.createRequestUserFromCredentials(
        createdUser.credentials,
      );
      user.authentication = 'Registered';
      return user;
    }
    const user = this.createRequestUserFromCredentials(credentialsByEmail);
    user.authentication = 'Logged-in';
    return user;
  }

  async ftRegisterUser(userInfo: FtRegisterUserDto) {
    /* creates a user using the information from FortyTwo Oauth2 flow
     * this means that the user doesn't have a password in the Credentials table
     */
    const user = await this.userService.createUserWithoutPassword(userInfo);
    return user;
  }

  /******************************* Local Auth Flow ****************************/

  handleLocalLogin(req: Request, res: Response) {
    return res.redirect(this.HOME_PAGE);
  }

  handleLocalRegister(payload: LocalRegisterUserDto, res: Response) {
    const user = this.localRegisterUser(payload);
    if (user) return res.redirect(this.HOME_PAGE);
    else return res.redirect(this.LOGIN_PAGE);
  }

  async validateUserCredentials(payload: UserLoginDto): Promise<User> {
    const userCredentials: Credentials =
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
    if (userDb) throw new userAlreadyRegisteredException();

    /* the strenght of the hashing algorithm */
    const saltRounds: number = 10;
    const salt: string = await Bcrypt.genSalt(saltRounds);
    const hash: string = await Bcrypt.hash(userInfo.password, salt);

    const createdUser = await this.userService.createUserWithPassword(
      userInfo,
      hash,
    );
    return createdUser;
  }

  /********************************** Successful Login *****************************/

  async handleSuccessLogin(requestUser: RequestUser) {
    /* this function is called upon successful login and deletes the authMessage property
     * which contains either: "User Logged-in" or "User Registered" type message.
     */
    const message: string = requestUser.authentication;
    delete requestUser.authentication;
    const user: User = await this.userService.findOne(requestUser.id);
    return { message: message, user: user };
  }

  /********************************** Logout **********************************/

  async handleLogout(req: Request, res: Response) {
    if (req.session) {
      req.session.destroy();
      res.clearCookie('auth_session', { path: '/' });
      console.debug(`Logout User ${req.user}`);
      return { message: 'user logged-out successfuly' };
    }
  }

  /********************************** 2FA Flow ********************************/

  async generateTwoFactorCode(user: RequestUser) {
    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(
      user.username,
      this.config.get('TWO_FA_APP_NAME'),
      secret,
    );
    const res = await this.userService.setTwoFactorSecret(user.id, secret);
    console.log(
      `This is the result I got from res ${JSON.stringify(res, null, 4)}`,
    );
    return { secret, otpAuthUrl };
  }

  async turnOnTwoFactorAuth(user: RequestUser, twoFactorCode: string) {
    const isCodeValid = this.verifyTwoFactorCode(twoFactorCode, user);
    if (isCodeValid)
      return await this.userService.setTwoFactorAuthentification(user.id, true);

    throw new UnauthorizedException('Bad 2FA Code');
  }

  async pipeQrCodeStream(stream: Response, otpAuthUrl: string) {
    /* returns a Generated Qr Code as a stream for Two Factor Auth */
    return toFileStream(stream, otpAuthUrl);
  }

  async verifyTwoFactorCode(twoFactorCode: string, user: RequestUser) {
    const userDb: Credentials =
      await this.userService.getUserCredentialsByEmail(user.email);
    return authenticator.verify({
      token: twoFactorCode,
      secret: userDb.twoFactorSecret,
    });
  }

  async handleTwoFactorLoggin(twoFactorCode: string, user: RequestUser) {
    const isCodeValid: boolean = await this.verifyTwoFactorCode(
      twoFactorCode,
      user,
    );
    if (!isCodeValid)
      throw new UnauthorizedException('bad code in HandleTwoFactorLoggin');

    user.isTwoFactorAuthenticated = true;
    return { message: 'Two factor registered successfully!' };
  }
  /********************************** Helpers ********************************/

  createRequestUserFromCredentials(credentials: Credentials): RequestUser {
    /* Creates a RequestUser object from credentials object. Used mainly to save
     * space and for clarity of code */
    const requestUser: RequestUser = {
      id: credentials.userId,
      username: credentials.username,
      email: credentials.email,
      isTwoFactorActivated: credentials.twoFactorActivated,
      isTwoFactorAuthenticated: false,
    };
    return requestUser;
  }

  async areCredentialsTaken(username: string, email: string) {
    /* Checks if username and email are taken
     * we do this by checking if the username and the password exist in the database */
    const userCredentialsByEmail: Credentials =
      await this.userService.getUserCredentialsByEmail(email);
    if (userCredentialsByEmail !== null) return true;

    const userCredentialsByUsername: Credentials =
      await this.userService.getUserCredentialsByUsername(username);
    if (userCredentialsByEmail !== null) return true;

    return false;
  }
}
