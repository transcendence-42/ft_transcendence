import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  imports: [ConfigModule],
  exports: [PrismaModule],
})
export class PrismaModule {}
