import {
  Body,
  Catch,
  Controller,
  ForbiddenException,
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
import { LocalRegisterUserDto } from './dto/registerUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**** 42 Oauth2 flow ****/

  @UseGuards(FtAuthGuard)
  @Get('42/redirect')
  FtRedirec(@Response() res) {
    return this.authService.handleFtRedirect(res);
  }

  @UseGuards(LoggedInGuard)
  @Get('success')
  SuccessLogin(@Request() req) {
    return this.authService.handleSuccessLogin(req.user);
  }

  @UseGuards(FtAuthGuard)
  @Get('42/register')
  handleFtUserRegistration() {}

  /**** local Authentication flow ****/

  @UseGuards(LocalAuthGuard)
  @Post('login')
  LocalLogin(@Request() req, @Response() res) {
    return this.authService.handleLocalLogin(req, res);
  }

  @Post('register')
  @UsePipes(ValidationPipe)
  LocalRegister(@Body() payload: LocalRegisterUserDto, @Response() res) {
    return this.authService.handleLocalRegister(payload, res);
  }

  /**** Logout flow  ****/
  @UseGuards(LoggedInGuard)
  @Get('logout')
  Logout(@Request() req, @Response() res) {
    return this.authService.handleLogout(req, res);
  }

  /*** Helper function for dev only. Helps to see if the user is logged in.*/

  @UseGuards(LoggedInGuard)
  @Get('status')
  isLoggedIn(@Session() session, @Request() req) {
    return `User is logged in with session' ${JSON.stringify(session)}`;
  }
}
