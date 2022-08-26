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
import { FtAuthGuard, LoggedInGuard, LocalAuthGuard } from './guards';
import { LocalRegisterUserDto } from './dto/registerUser.dto';
import { User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private config: ConfigService,
    private readonly authService: AuthService,
  ) {}

  /**** 42 Oauth2 flow ****/

  @UseGuards(FtAuthGuard)
  @Get('42/redirect')
  handleFtRedirec(@Request() req): any {
    return `Validated user\n:  ${JSON.stringify(req.user)}`;
  }

  @UseGuards(FtAuthGuard)
  @Get('42/register')
  handleFtUserRegistration(@Request() req) {
    // check if username and email are not registered in the database
    const user = req.user;
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
  isLoggedIn(@Session() session) {
    return `User is logged in with session' ${JSON.stringify(session)}`;
  }

}
