import { Module } from '@nestjs/common';
import { ChannelModule } from 'src/channels/channel.module';
import { ChannelService } from 'src/channels/channel.service';
import { FriendshipService } from 'src/friendship/friendship.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisModule } from 'src/redis/redis.module';
import { UserService } from 'src/user/user.service';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  imports: [RedisModule],
  providers: [
    ChatGateway,
    ChatService,
    ChannelService,
    UserService,
    FriendshipService,
    PrismaService,
  ],
})
export class ChatModule {}
