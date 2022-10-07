import { Module } from '@nestjs/common';
import { PictureService } from './picture.service';
import { PictureController } from './picture.controller';
import { UserService } from 'src/user/user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { FriendshipService } from 'src/friendship/friendship.service';

@Module({
  imports: [PrismaModule],
  controllers: [PictureController],
  providers: [PictureService, UserService, PrismaService, FriendshipService],
})
export class PictureModule {}
