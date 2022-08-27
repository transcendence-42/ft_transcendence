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
import { TwoFactorGuard } from './guards/twoFa.auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**** 42 Oauth2 flow ****/

  @UseGuards(FtAuthGuard)
  @Get('42/redirect')
  ftRedirec(@Response() res, @Request() req) {
    return this.authService.handleFtRedirect(res, req.user);
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

  @UseGuards(LocalAuthGuard)
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
  @UseGuards(TwoFactorGuard)
  @Get('2fa/generate')
  async generateTwoFa(@Request() req, @Response() res) {
    const { otpAuthUrl } = await this.authService.generateTwoFactorCode(
      req.user,
    );
    req.user.isTwoFactorAuthenticated = true;
    return this.authService.pipeQrCodeStream(res, otpAuthUrl);
  }

  @UseGuards(TwoFactorGuard)
  @Post('2fa/activate')
  activateTwoFactorAuth(@Request() req, @Body() twoFactorCode: TwoFactorDto) {
    this.authService.turnOnTwoFactorAuth(req.user, twoFactorCode.code);
    return { message: '2FA activated!' };
  }

  @UseGuards(TwoFactorGuard)
  @Post('2fa/authenticate')
  validateTwoAuthAuth(
    @Request() req,
    @Response() res,
    @Body() twoFactorCode: TwoFactorDto,
  ) {
    return this.authService.handleTwoFactorLoggin(twoFactorCode.code, req.user);
  }

  /*** Helper function for dev only. Helps to see if the user is logged in.*/

  @UseGuards(LoggedInGuard)
  @Get('status')
  isLoggedIn(@Session() session, @Request() req) {
    console.debug(`This is user ${JSON.stringify(req, null, 4)}`);
    return `User is logged in with session' ${JSON.stringify(session)}`;
  }
}
