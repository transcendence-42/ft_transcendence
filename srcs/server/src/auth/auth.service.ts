import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import {
  FtRegisterUserDto,
  LocalRegisterUserDto,
} from './dto/registerUser.dto';
import { Credentials, User } from '@prisma/client';
import * as Bcrypt from 'bcryptjs';
import { LocalLoginUserDto } from './dto/login.dto';
import {
  BadCredentialsException,
  CredentialsTakenException,
} from './exceptions';
import { UserNotFoundException } from 'src/user/exceptions';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { RequestUser } from '../common/entities/requestUser.entity';
import { Response } from 'express';
import * as Session from 'express-session';
import { UserAlreadyExistsException } from '../user/exceptions/';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly config: ConfigService,
  ) {}
  private readonly LOGIN_PAGE: string = this.config.get('LOGIN_PAGE');
  private readonly HOME_PAGE: string = this.config.get('HOME_PAGE');
  private readonly logger = new Logger(AuthService.name);

  /******************************* 42 Oauth2 Flow ******************************/

  handleFtRedirect(user: RequestUser, res: Response) {
    console.debug(`redirecting to Home`);
    return res.redirect(this.HOME_PAGE);
  }

  /* this function validates the user by doing two things:
   * 1- Checks whether the user already has an account
   * using the local authentication method. If so, it throws and exception.
   * 2- Creates a new user if the user is not registered
   * returns an object containing a RequestUser and a message to specify if the user
   * logged in or signed up
   */
  async validateFtUser(userInfo: FtRegisterUserDto): Promise<RequestUser> {
    const credentialsByEmail: Credentials =
      await this.userService.getUserCredentialsByEmail(userInfo.email);
    if (credentialsByEmail !== null && credentialsByEmail.password)
      throw new CredentialsTakenException(
        'Found a user with the same email in database',
      );
    const credentialsByUsername: Credentials =
      await this.userService.getUserCredentialsByUsername(userInfo.username);
    if (credentialsByUsername !== null && credentialsByUsername.password)
      throw new CredentialsTakenException(
        `found username ${credentialsByUsername.username} with a password in database`,
      );

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

  /* creates a user using the information from FortyTwo Oauth2 flow
   * this means that the user doesn't have a password in the Credentials table
   */
  async ftRegisterUser(userInfo: FtRegisterUserDto) {
    const user = await this.userService.createUserWithoutPassword(userInfo);
    return user;
  }

  /******************************* Local Auth Flow ****************************/

  async handleLocalRegister(payload: LocalRegisterUserDto, res: Response) {
    const user: User = await this.localRegisterUser(payload);
    if (user) return res.send({ message: 'Account created successfully!' });
  }

  async localRegisterUser(userInfo: LocalRegisterUserDto): Promise<User> {
    /* Registers the user with a username, email and password */
    const userCredentialsByEmail: Credentials =
      await this.userService.getUserCredentialsByEmail(userInfo.email);
    if (userCredentialsByEmail)
      throw new UserAlreadyExistsException(userInfo.email);
    const userCredentialsByUsername: Credentials =
      await this.userService.getUserCredentialsByUsername(userInfo.username);
    if (userCredentialsByUsername)
      throw new UserAlreadyExistsException(userInfo.username);

    /* the strenght of the hashing algorithm */
    const saltRounds = 10;
    const salt: string = await Bcrypt.genSalt(saltRounds);
    const hash: string = await Bcrypt.hash(userInfo.password, salt);

    const createdUser = await this.userService.createUserWithPassword(
      userInfo,
      hash,
    );
    return createdUser;
  }

  async handleLocalLogin(user: RequestUser, res: Response) {
    if (
      user.isTwoFactorActivated === true &&
      user.isTwoFactorAuthenticated === false
    ) {
      this.logger.log(`redirecting to 2fa`);
      res.redirect('http://127.0.0.1:3042/2fa');
    } else {
      this.logger.log(`redirecting to Home`);
      return res.redirect(this.HOME_PAGE);
    }
  }

  async validateLocalUser(payload: LocalLoginUserDto): Promise<RequestUser> {
    const userDb: Credentials =
      await this.userService.getUserCredentialsByEmail(payload.email);
    if (!userDb) throw new BadCredentialsException('Invalid email!');
    if (userDb.password === null)
      throw new BadCredentialsException('User doesnt have local account!');

    const validUser: boolean = await Bcrypt.compare(
      payload.password,
      userDb.password,
    );
    if (!validUser) throw new BadCredentialsException('Invalid password!');

    const user: RequestUser = this.createRequestUserFromCredentials(userDb);
    user.authentication = 'Logged-in';
    return user;
  }

  /********************************** Successful Login *****************************/

  /* this function is called upon successful login and deletes
   * the authMessage property which contains either:
   * "User Logged-in" or "User Registered" type message.
   */
  async handleSuccessLogin(
    requestUser: RequestUser,
  ): Promise<{ message: string; user: User }> {
    /* this function is called upon successful login and deletes
     * the authMessage property which contains either:
     * "User Logged-in" or "User Registered" type message.
     */
    if (
      requestUser.isTwoFactorActivated === true &&
      requestUser.isTwoFactorAuthenticated === false
    ) {
      return { message: 'require 2fa', user: undefined };
    }
    const message: string = requestUser.authentication;
    delete requestUser.authentication;
    const user: User = await this.userService.findOne(requestUser.id);
    return { message: message, user: user };
  }

  /******************************** Logout Flow *******************************/

  handleLogout(user: RequestUser, res: Response, session: Session) {
    if (session) {
      session.destroy();
      res.clearCookie('auth_session', { path: '/' });
      this.logger.log(`Logout User ${JSON.stringify(user, null, 4)}`);
      res.send({ message: 'user logged-out successfuly' });
    }
  }

  /********************************** 2FA Flow ********************************/

  async handleTwoFactorCodeGen(user: RequestUser, res: Response) {
    const otpAuthUrl: string = await this.generateTwoFactorCode(user);
    return this.pipeQrCodeStream(res, otpAuthUrl);
  }

  /* Genereates A two factor authentification secret for the user and
   * adds it to the database and generates a Qr Code to be used by the user
   * to sync their google auth app with our application
   */
  async generateTwoFactorCode(user: RequestUser): Promise<string> {
    const secret: string = authenticator.generateSecret();
    const otpAuthUrl: string = authenticator.keyuri(
      user.username,
      this.config.get('TWO_FA_APP_NAME'),
      secret,
    );
    await this.userService.setTwoFactorSecret(user.id, secret);
    return otpAuthUrl;
  }

  /* In order to turn on Two Factor Authentication, we need to validate
   * the user's code against our own to see if the secret matches
   */
  async turnOnTwoFactorAuth(
    user: RequestUser,
    twoFactorCode: string,
  ): Promise<{ message: string }> {
    /* In order to turn on Two Factor Authentication, we need to validate
     * the user's code against our own to see if the secret matches
     */
    const isCodeValid = await this.verifyTwoFactorCode(twoFactorCode, user);
    if (isCodeValid) {
      await this.userService.setTwoFactorAuthentification(user.id, true);
      return { message: '2FA activated!' };
    }
    return { message: 'Bad 2FA Code' };
  }

  /* returns a Generated Qr Code as a stream for Two Factor Auth */
  async pipeQrCodeStream(stream: Response, otpAuthUrl: string) {
    return toFileStream(stream, otpAuthUrl);
  }

  async verifyTwoFactorCode(twoFactorCode: string, user: RequestUser) {
    const userDb: Credentials =
      await this.userService.getUserCredentialsByEmail(user.email);
    if (!userDb.twoFactorSecret) return false;
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
    console.log('validating code');
    if (!isCodeValid) throw new UnauthorizedException('Bad 2FA Code!');
    user.isTwoFactorAuthenticated = true;
    return { message: 'Logged in with Two factor successfully!' };
  }

  async isTwoFaActivated(id: number): Promise<boolean> {
    const userDb = await this.userService.findOne(id);
    if (!userDb) throw new UserNotFoundException(id);
    const credentials = await this.userService.getUserCredentialsByEmail(
      userDb.email,
    );
    console.log(`-----------------------${JSON.stringify(credentials)}`);
    if (credentials && credentials.twoFactorActivated) {return true};
    return false;
  }
  /********************************** Helpers ********************************/

  /* Creates a RequestUser object from credentials object. Used mainly to save
   * space and for clarity of code */
  createRequestUserFromCredentials(credentials: Credentials): RequestUser {
    const requestUser: RequestUser = {
      id: credentials.userId,
      username: credentials.username,
      email: credentials.email,
      isTwoFactorActivated: credentials.twoFactorActivated,
      isTwoFactorAuthenticated: false,
    };
    return requestUser;
  }

  /* Checks if username and email are taken
   * we do this by checking if the username and the password exist in the database */
  async areCredentialsTaken(username: string, email: string) {
    const userCredentialsByEmail: Credentials =
      await this.userService.getUserCredentialsByEmail(email);
    if (userCredentialsByEmail !== null) return true;

    const userCredentialsByUsername: Credentials =
      await this.userService.getUserCredentialsByUsername(username);
    if (userCredentialsByEmail !== null) return true;

    return false;
  }
}
