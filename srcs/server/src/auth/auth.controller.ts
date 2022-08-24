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
import { ConfigService } from '@nestjs/config';
import { FtAuthGuard, LoggedInGuard, LocalAuthGuard } from './guards';
import { LocalRegisterUserDto } from './dto/registerUser.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private config: ConfigService,
    private readonly authService: AuthService,
  ) {}
  LOGIN_PAGE: string = this.config.get('LOGIN_PAGE');
  HOME_PAGE: string = this.config.get('HOME_PAGE');

  /**** 42 Oauth2 flow ****/

  @UseGuards(FtAuthGuard)
  @Get('42/redirect')
  FtRedirec(@Request() req, @Response() res): any {
    console.log(
      `Returning response from /redirect ${JSON.stringify(req.user, null, 4)}`,
    );
    return this.authService.handleFtRedirect(res);
  }

  @UseGuards(LoggedInGuard)
  @Get('success')
  handleSuccess(@Request() req, @Response() res, @Session() ses) {
    console.debug(
      `Returning User-session ${JSON.stringify(
        ses,
        null,
        4,
      )} and User ${JSON.stringify(req.user, null, 4)}`,
    );
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

  @UseGuards(FtAuthGuard)
  @Get('42/register')
  handleFtUserRegistration() {}

  /**** local Authentication flow ****/
  @UseGuards(LocalAuthGuard)
  @Post('login')
  handleLocalLogin(@Request() req, @Response() res) {
    return res.redirect(this.HOME_PAGE);
  }

  @Post('register')
  @UsePipes(ValidationPipe)
  handleLocalRegister(@Body() payload: LocalRegisterUserDto, @Response() res) {
    // return this.authService.localRegisterUser(payload);
    const user = this.authService.localRegisterUser(payload);
    if (user) return res.redirect(this.HOME_PAGE);
    else return res.redirect(this.LOGIN_PAGE);
  }

  /*** Helper function for dev only. Helps to see if the user is logged in.*/
  @UseGuards(LoggedInGuard)
  @Get('status')
  isLoggedIn(@Session() session, @Request() req) {
    return `User is logged in with session' ${JSON.stringify(session)}`;
  }
}
