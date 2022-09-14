import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { FriendshipModule } from './friendship/friendship.module';
import { MatchModule } from './match/match.module';
import { RatingModule } from './rating/rating.module';
import { ChatGateway } from './chat/chat.gateway';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    PrismaModule,
    UserModule,
    FriendshipModule,
    MatchModule,
    RatingModule,
  ],
  controllers: [],
  providers: [ChatGateway],
})
export class AppModule {}
