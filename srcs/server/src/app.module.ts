import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PassportModule, PassportSerializer } from '@nestjs/passport';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    ConfigModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
