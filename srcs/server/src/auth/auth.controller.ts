import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Response,
  Session,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { FtAuthGuard, LoggedInGuard, LocalAuthGuard } from './guards';
import { LocalRegisterUserDto, TwoFactorDto } from './dto/index';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**** 42 Oauth2 flow ****/

  @UseGuards(FtAuthGuard)
  @Get('42/redirect')
  ftRedirec(@Response() res, @Request() req) {
    return this.authService.handleFtRedirect(res, req);
  }

  @UseGuards(FtAuthGuard)
  @Get('42/register')
  handleFtUserRegistration() {}

  /**** local Authentication flow ****/

  @UseGuards(LocalAuthGuard)
  @Post('login')
  localLogin(@Request() req, @Response() res) {
    return this.authService.handleLocalLogin(req, res);
  }

  @Post('register')
  @UsePipes(ValidationPipe)
  localRegister(@Body() payload: LocalRegisterUserDto, @Response() res) {
    return this.authService.handleLocalRegister(payload, res);
  }

  /**** Redirection page when user succesfuly registers or signs in ****/
  @UseGuards(LoggedInGuard)
  @Get('success')
  successLogin(@Request() req) {
    return this.authService.handleSuccessLogin(req.user);
  }

  /**** Logout flow  ****/
  @UseGuards(LoggedInGuard)
  @Get('logout')
  logout(@Request() req, @Response() res) {
    return this.authService.handleLogout(req, res);
  }

  /**** 2fa flow  ****/
  @UseGuards(LoggedInGuard)
  @Get('2fa/generate')
  async generateTwoFa(@Request() req, @Response() res) {
    const { otpAuthUrl } = await this.authService.generateTwoFactorCode(
      req.user,
    );
    return this.authService.pipeQrCodeStream(res, otpAuthUrl);
  }

  @UseGuards(LoggedInGuard)
  @Post('2fa/activate')
  activateTwoFactorAuth(@Request() req, @Body() twoFactorCode: TwoFactorDto) {
    this.authService.turnOnTwoFactorAuth(req.user, twoFactorCode.code);
    return { message: '2FA activated!' };
  }

  @UseGuards(LoggedInGuard)
  @Post('2fa/authenticate')
  validateTwoAuthAuth(@Request() req, @Body() twoFactorCode: TwoFactorDto) {}

  /*** Helper function for dev only. Helps to see if the user is logged in.*/

  @UseGuards(LoggedInGuard)
  @Get('status')
  isLoggedIn(@Session() session, @Request() req) {
    return `User is logged in with session' ${JSON.stringify(session)}`;
  }

  @Get('activate')
  activateTwoFa(@Request() req) {
    const ret = this.authService.activateTwoFa(req.user, false);
    return { message: ret };
  }
}
