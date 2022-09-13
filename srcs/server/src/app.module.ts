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
    AuthModule,
    PrismaModule,
    UserModule,
    FriendshipModule,
    MatchModule,
    RatingModule,
    GameModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
