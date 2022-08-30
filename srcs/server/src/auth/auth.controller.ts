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
      `Returning response from /redirect ${JSON.stringify(req.user)}`,
    );
    console.log(`Is user authenticated ? ${req.isAuthenticated()}`);
    return res.redirect('http://127.0.0.1:3042/');
    return req.user;
  }

  @UseGuards(LoggedInGuard)
  @Get('success')
  handleSuccess(@Request() req, @Response() res, @Session() ses) {
    console.log(
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
  handleFtUserRegistration(@Request() req) {
    // check if username and email are not registered in the database
    // const user = req.user;
  }

  /**** local Authentication flow ****/
  @UseGuards(LocalAuthGuard)
  @Post('login')
  handleLocalLogin(@Request() req) {
    return req.user;
  }

  @Post('register')
  @UsePipes(ValidationPipe)
  handleLocalRegister(@Body() payload: LocalRegisterUserDto): Promise<User> {
    return this.authService.localRegisterUser(payload);
  }

  /*** Helper function for dev only. Helps to see if the user is logged in.*/
  @UseGuards(LoggedInGuard)
  @Get('status')
  isLoggedIn(@Session() session, @Request() req) {
    return `User is logged in with session' ${JSON.stringify(session)}`;
  }
}
