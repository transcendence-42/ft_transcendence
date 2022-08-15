import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as Session from 'express-session';
import * as Passport from 'passport';
import { ConfigService } from '@nestjs/config';
import * as Redis from 'redis';
import * as ConnectRedis from 'connect-redis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new ConfigService();
  const redisClient = Redis.createClient({
    url: config.get('REDIS_URL'),
    legacyMode: true,
  }) as any;
  const redisStore = await ConnectRedis(Session);
  redisClient.connect();
  redisClient.on('connect', () => {
    console.log('Connected to Redis');
  });

  app.use(
    Session({
      saveUninitialized: false,
      secret: config.get('SESSION_SECRET'),
      resave: false,
      name: 'auth_session',
      cookie: {
        maxAge: 60000 * 60 * 24 * 30 * 3, // 3 months as per RGPD
      },
      store: new redisStore({ client: redisClient }),
    }),
  );
  app.use(Passport.initialize());
  app.use(Passport.session());
  await app.listen(8080);
}

bootstrap();
