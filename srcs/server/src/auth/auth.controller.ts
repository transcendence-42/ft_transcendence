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
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(
    private config: ConfigService,
    private readonly authService: AuthService,
  ) {}

  /**** 42 Oauth2 flow ****/

  @UseGuards(FtAuthGuard)
  @Get('42/redirect')
  handleFtRedirec(@Request() req, @Response() res): any {
    console.log(
      `Returning response from /redirect ${JSON.stringify(req.user, null, 4)}`,
    );
    return res.redirect('http://127.0.0.1:3042/');
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
  handleFtUserRegistration(@Request() req) {}

  /**** local Authentication flow ****/
  @UseGuards(LocalAuthGuard)
  @Post('login')
  handleLocalLogin(@Request() req, @Response() res) {
    return res.redirect('http://127.0.0.1:3042/');
  }

  @Post('register')
  @UsePipes(ValidationPipe)
  handleLocalRegister(@Body() payload: LocalRegisterUserDto, @Response() res) {
    // return this.authService.localRegisterUser(payload);
    const user = this.authService.localRegisterUser(payload);
    if (user) return res.redirect('http://127.0.0.1:3042/');
    else return res.redirect('http://127.0.0.1:3042/login');
  }

  /*** Helper function for dev only. Helps to see if the user is logged in.*/
  @UseGuards(LoggedInGuard)
  @Get('status')
  isLoggedIn(@Session() session, @Request() req) {
    return `User is logged in with session' ${JSON.stringify(session)}`;
  }
}
