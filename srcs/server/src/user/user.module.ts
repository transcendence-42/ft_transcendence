import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FriendshipService } from 'src/friendship/friendship.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, FriendshipService],
})
export class UserModule {}
