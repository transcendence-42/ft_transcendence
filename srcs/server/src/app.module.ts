import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { FriendshipModule } from './friendship/friendship.module';
import { MatchModule } from './match/match.module';
import { RatingModule } from './rating/rating.module';
import { ChatModule } from './chat/chat.module';

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
  ],
  controllers: [],
})
export class AppModule {}
