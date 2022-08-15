import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FtAuthGuard, LocalAuthGuard, LoggedInGuard } from './guards';
import { Serialization } from './serialization/SessionSerialization';
import { FtStrategy } from './strategies/ft.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [ConfigModule, PassportModule.register({ session: true })],
  controllers: [AuthController],
  providers: [
    AuthService,
    FtStrategy,
    LocalStrategy,
    FtAuthGuard,
    UserService,
    PrismaService,
    Serialization,
    LoggedInGuard,
    LocalAuthGuard,
  ],
})
export class AuthModule {}
