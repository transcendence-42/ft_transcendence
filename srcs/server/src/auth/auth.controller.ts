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

  /******************************* 42 OAuth Flow ******************************/

  @UseGuards(FtAuthGuard)
  @Get('42/redirect')
  ftRedirec(@Request() req, @Response() res) {
    return this.authService.handleFtRedirect(req.user, res);
  }

  @UseGuards(FtAuthGuard)
  @Get('42/register')
  handleFtUserRegistration() {}

  /******************************* Local Auth Flow ****************************/

  @UseGuards(LocalAuthGuard)
  @Post('register')
  @UsePipes(ValidationPipe)
  localRegister(@Body() payload: LocalRegisterUserDto, @Response() res) {
    return this.authService.handleLocalRegister(payload, res);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  localLogin(@Request() req, @Response() res) {
    return this.authService.handleLocalLogin(req, res);
  }

  /****************************** Succesful Login *****************************/
  @UseGuards(LoggedInGuard)
  @Get('success')
  successLogin(@Request() req) {
    return this.authService.handleSuccessLogin(req.user);
  }

  /******************************* Logout Flow ********************************/
  @UseGuards(LoggedInGuard)
  @Get('logout')
  logout(@Request() req, @Response() res) {
    return this.authService.handleLogout(req.user, res, req.session);
  }

  /*************************** 2 Factor Auth Flow *****************************/
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
  validateTwoAuthAuth(@Request() req, @Body() twoFactorCode: TwoFactorDto) {
    return this.authService.handleTwoFactorLoggin(twoFactorCode.code, req.user);
  }

  /**************************** Helpers for Dev *******************************/
  /*** Helper function for dev only. Helps to see if the user is logged in.*/

  @UseGuards(LoggedInGuard)
  @Get('status')
  isLoggedIn(@Session() session, @Request() req) {
    console.debug(`This is user ${JSON.stringify(req, null, 4)}`);
    return `User is logged in with session' ${JSON.stringify(session)}`;
  }
}
