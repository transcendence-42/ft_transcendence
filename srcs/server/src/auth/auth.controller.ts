import {
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Request,
  Response,
  Session,
  UnauthorizedException,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { FtAuthGuard, LoggedInGuard, LocalAuthGuard } from './guards';
import {
  LocalLoginUserDto,
  LocalRegisterUserDto,
  TwoFactorDto,
} from './dto/index';
import { TwoFactorGuard } from './guards/twoFa.auth.guard';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiForbiddenResponse,
  ApiOAuth2,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  AuthResponse,
  AuthSuccessResponse,
} from 'src/common/entities/response.entity';
import { FtExceptionFilter } from './filters/ftAuthException.filter';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /******************************* 42 OAuth Flow ******************************/

  @UseGuards(FtAuthGuard)
  @UseFilters(FtExceptionFilter)
  @Get('42/redirect')
  @ApiExcludeEndpoint()
  ftRedirec(@Request() req, @Response() res) {
    return this.authService.handleFtRedirect(req.user, res);
  }

  @UseGuards(FtAuthGuard)
  @Get('42/register')
  @ApiOAuth2(['username', 'email', 'profile picture'], '42 Oauth2')
  @ApiOperation({
    summary: 'Triggers the Oauth2 flow from school 42',
    description:
      'Triggers the Oauth2 flow from school 42. Redirects to client/home if successful.',
  })
  handleFtUserRegistration() {}

  /******************************* Local Auth Flow ****************************/

  @Post('local/register')
  @ApiOperation({ summary: 'registers a user' })
  @ApiCreatedResponse({
    description: 'Registered user',
    type: AuthResponse,
  })
  @ApiConflictResponse({
    description: 'When user already registered',
    type: ConflictException,
  })
  @ApiUnauthorizedResponse({
    description: 'When bad credentials ',
    type: UnauthorizedException,
  })
  localRegister(@Body() payload: LocalRegisterUserDto, @Response() res) {
    return this.authService.handleLocalRegister(payload, res);
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('local/login')
  @ApiOperation({ summary: 'Logs a user in ' })
  @ApiOkResponse({
    description: 'redirection to {client}/home',
  })
  @ApiUnauthorizedResponse({
    description: 'When bad credentials ',
    type: UnauthorizedException,
  })
  localLogin(
    @Request() req,
    @Body() payload: LocalLoginUserDto,
    @Response() res,
  ) {
    return this.authService.handleLocalLogin(req.user, res);
  }

  /****************************** Succesful Login *****************************/

  @ApiOperation({
    summary: 'Fetches the user data associated with the auth session',
    description:
      'An endpoint to be called from the front end to fetch the user info once ' +
      'they are registered and have an auth session cookie.',
  })
  @ApiOkResponse({
    description: 'The user associated with the auth session cookie',
    type: AuthSuccessResponse,
  })
  @ApiForbiddenResponse({
    description: 'when the request doesnt have a valid auth session',
    type: ForbiddenException,
  })
  @UseGuards(LoggedInGuard)
  @Get('success')
  successLogin(@Request() req) {
    return this.authService.handleSuccessLogin(req.user);
  }

  /******************************* Logout Flow ********************************/

  @UseGuards(LoggedInGuard)
  @Get('logout')
  @ApiOperation({ summary: 'Logs a user out and deletes their session' })
  @ApiOkResponse({
    description:
      'An object that contains a message: user logged-out successfuly',
    type: AuthResponse,
  })
  @ApiForbiddenResponse({
    description: 'When user is not logged in',
    type: ForbiddenException,
  })
  logout(@Request() req, @Response() res) {
    return this.authService.handleLogout(req.user, res, req.session);
  }

  /*************************** 2 Factor Auth Flow *****************************/

  @UseGuards(TwoFactorGuard)
  @Get('2fa/generate')
  @ApiOperation({
    summary: 'Returns a a secret 2FA code embeded in a QR Code',
    description:
      'Generates a secret 2FA code for the user and stores it in the database ' +
      'and returns a QR code',
  })
  async generateTwoFa(@Request() req, @Response() res) {
    res.setHeader('content-type', 'image/png');
    return this.authService.handleTwoFactorCodeGen(req.user, res);
  }

  @UseGuards(TwoFactorGuard)
  @HttpCode(200)
  @Post('2fa/activate')
  @ApiOperation({
    summary: 'Activates 2Factor Authentication',
    description:
      'An endpoint to call after /generate and after the user has ' +
      'scanned the qr code. If the supplied code is valid, activates 2FA on the next login.',
  })
  @ApiOkResponse({
    description: 'message: 2FA activated!',
    type: AuthResponse,
  })
  @ApiForbiddenResponse({
    description:
      'Returns a Forbidden Resource if the request doesnt contain a valid auth session.',
    type: ForbiddenException,
  })
  @ApiUnauthorizedResponse({
    description:
      "Returns an Unauthorized Resource if the code doesn't match or the user deosn't " +
      'have a secret in the database.',
    type: UnauthorizedException,
  })
  activateTwoFactorAuth(@Request() req, @Body() twoFactorCode: TwoFactorDto) {
    return this.authService.turnOnTwoFactorAuth(req.user, twoFactorCode.code);
  }

  @UseGuards(TwoFactorGuard)
  @HttpCode(200)
  @Post('2fa/authenticate')
  @ApiOperation({
    summary: 'Authenticates using a 2FA code',
    description:
      'updates the session cookie of the user to let them access protected resources',
  })
  @ApiOkResponse({
    description: 'message: Logged in with Two factor successfully!',
    type: AuthResponse,
  })
  validateTwoAuthAuth(@Request() req, @Body() twoFactorCode: TwoFactorDto) {
    return this.authService.handleTwoFactorLoggin(twoFactorCode.code, req.user);
  }

  @UseGuards(TwoFactorDto)
  @Get('2fa/state')
  isTwoFaActivated(@Request() req) {
    if (req.user && req.user.isTwoFactorActivated) return { message: 'on' };
    return { message: 'off' };
  }

  /**************************** Helpers for Dev *******************************/
  /*** Helper function for dev only. Helps to see if the user is logged in.*/
  @UseGuards(LoggedInGuard)
  @Get('status')
  @ApiExcludeEndpoint()
  isLoggedIn(@Session() session, @Request() req) {
    console.debug(`This is user ${JSON.stringify(req, null, 4)}`);
    return `User is logged in with session' ${JSON.stringify(session)}`;
  }
}
