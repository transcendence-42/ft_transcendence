import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { FtAuthGuard } from './guards/ft.auth.guard';
import { LocalGuard } from './guards/local.auth.guard';
import { RegisterUserDto } from './dto/registerUser.dto';
import { UserLoginDto } from './dto/login.dto';
import { User } from '@prisma/client';

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
  @UseGuards(LocalGuard)
  @Post('login')
  handleLocalLogin(@Request() req) {
    return req.user;
    // return this.authService.validateUserCredentials(payload);
  }

  @Post('register')
  @UsePipes(ValidationPipe)
  handleLocalRegister(@Body() payload: RegisterUserDto): any {
    return this.authService.registerUser(payload);
  }
}
