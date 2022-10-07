import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FriendshipService } from 'src/friendship/friendship.service';
import { PictureService } from 'src/picture/picture.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, FriendshipService, PictureService],
})
export class UserModule {}
