import { Module } from '@nestjs/common';
import { PictureService } from './picture.service';
import { PictureController } from './picture.controller';
import { UserService } from 'src/user/user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { FriendshipService } from 'src/friendship/friendship.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [PictureController],
  providers: [
    PictureService,
    UserService,
    PrismaService,
    FriendshipService,
    ConfigService,
  ],
})
export class PictureModule {}
