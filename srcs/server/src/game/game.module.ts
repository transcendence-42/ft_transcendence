import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { GameGateway } from './game.gateway';
import { FriendshipService } from 'src/friendship/friendship.service';
import { PhysicsService } from 'src/physics/physics.service';

@Module({
  providers: [
    GameGateway,
    GameService,
    PrismaService,
    UserService,
    FriendshipService,
    PhysicsService,
  ],
})
export class GameModule {}
