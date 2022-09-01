import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { RatingService } from './rating.service';

@Module({
  imports: [PrismaModule],
  providers: [RatingService, PrismaService],
})
export class RatingModule {}
