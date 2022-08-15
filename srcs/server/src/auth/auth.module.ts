import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  PassportModule,
  PassportSerializer,
  PassportStrategy,
} from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FtAuthGuard } from './guards/ft.auth.guard';
import {
  LocalAuthenticatedGuard,
  LocalAuthGuard,
} from './guards/local.auth.guard';
import { LocalSerialization } from './serialization/localSerialization';
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
    LocalAuthGuard,
    LocalAuthenticatedGuard,
    UserService,
    PrismaService,
    LocalSerialization,
  ],
})
export class AuthModule {}
