import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from 'src/user/user.service';
import { RatingService } from 'src/rating/rating.service';

@Module({
  imports: [PrismaModule],
  controllers: [MatchController],
  providers: [MatchService, PrismaService, UserService, RatingService],
})
export class MatchModule {}
