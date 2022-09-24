import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { FriendshipModule } from './friendship/friendship.module';
import { MatchModule } from './match/match.module';
import { RatingModule } from './rating/rating.module';
import { ChatModule } from './chat/chat.module';
import { RedisModule } from './redis/redis.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    PrismaModule,
    UserModule,
    FriendshipModule,
    MatchModule,
    RatingModule,
    ChatModule,
    RedisModule,
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            ignore: 'req.headers,res.headers',
            levelFirst:true, 
          },
        },
      },
    }),
  ],
  controllers: [],
})
export class AppModule {}
