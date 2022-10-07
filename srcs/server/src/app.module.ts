import { CacheModule, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { FriendshipModule } from './friendship/friendship.module';
import { MatchModule } from './match/match.module';
import { RatingModule } from './rating/rating.module';
import { GameModule } from './game/game.module';
import * as redisStore from 'cache-manager-redis-store';
import { RedisModule } from './redis/redis.module';
import { MulterModule } from '@nestjs/platform-express';
import { PictureModule } from './picture/picture.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'redis',
      port: 6379,
    }),
    MulterModule.register({
      dest: './uploads/',
    }),
    AuthModule,
    PrismaModule,
    UserModule,
    FriendshipModule,
    MatchModule,
    RatingModule,
    GameModule,
    RedisModule,
    PictureModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
