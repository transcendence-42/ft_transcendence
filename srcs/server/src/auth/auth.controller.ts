import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Session,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { FtAuthGuard } from './guards/ft.auth.guard';
import {
  LocalAuthGuard,
  LocalAuthenticatedGuard,
} from './guards/local.auth.guard';
import { RegisterUserDto } from './dto/registerUser.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private config: ConfigService,
    private readonly authService: AuthService,
  ) {}

  /**** 42 Oauth2 flow handles ****/

  @UseGuards(FtAuthGuard)
  @Get('42/redirect')
  handleFtRedirec(@Request() req): any {
    return 'Validated user' + req.user;
  }

  /**** local Authentication flow handles ****/
  @UseGuards(LocalAuthGuard)
  @Post('login')
  handleLocalLogin(@Request() req) {
    return req.user;
    // return this.authService.validateUserCredentials(payload);
  }

  @UseGuards(LocalAuthenticatedGuard)
  @Get('status')
  isLoggedIn(@Session() session) {
    return 'User is logged in with session' + { session };
  }

  @Post('register')
  @UsePipes(ValidationPipe)
  handleLocalRegister(@Body() payload: RegisterUserDto): any {
    return this.authService.registerUser(payload);
  }
}
