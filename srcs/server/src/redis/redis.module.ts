import { Module } from '@nestjs/common';
import * as Redis from 'redis';

@Module({
  providers: [
    {
      provide: 'REDIS_OPTIONS',
      useValue: {
        url: 'redis://redis:6379',
      },
    },
    {
      inject: ['REDIS_OPTIONS'],
      provide: 'REDIS_CLIENT',
      useFactory: async (options: { url: string }, legacyMode: true) => {
        const client = Redis.createClient(options);
        await client.connect();
        client.on('connect', () => console.log('Redis module connected'))
        return client;
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
