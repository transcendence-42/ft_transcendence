import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameGateway } from './game.gateway';
import { MatchService } from 'src/match/match.service';
import { UserService } from 'src/user/user.service';
import { RatingService } from 'src/rating/rating.service';
import { FriendshipService } from 'src/friendship/friendship.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [
    GameGateway,
    GameService,
    PrismaService,
    MatchService,
    UserService,
    RatingService,
    FriendshipService,
  ],
})
export class GameModule {}
