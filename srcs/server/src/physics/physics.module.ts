import { Module } from '@nestjs/common';
import { PhysicsService } from './physics.service';

@Module({
  providers: [PhysicsService],
})
export class PhysicsModule {}
