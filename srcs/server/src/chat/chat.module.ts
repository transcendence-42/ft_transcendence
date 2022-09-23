import { Module } from '@nestjs/common';
import { RedisModule } from 'src/redis/redis.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  imports: [RedisModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
