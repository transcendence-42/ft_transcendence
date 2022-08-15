import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule, PassportStrategy } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FtAuthGuard } from './guards/ft.auth.guard';
import { LocalGuard } from './guards/local.auth.guard';
import { FtStrategy } from './strategies/ft.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [ConfigModule, PassportModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    FtStrategy,
    LocalStrategy,
    FtAuthGuard,
    LocalGuard,
    UserService,
    PrismaService,
  ],
})
export class AuthModule {}
