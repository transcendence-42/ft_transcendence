import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as Session from 'express-session';
import * as Passport from 'passport';
import { ConfigService } from '@nestjs/config';
import * as Redis from 'redis';
import * as ConnectRedis from 'connect-redis';
import { cors } from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
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
  app.enableCors({origin: [/api\/.intra.42\.fr$/, 'http://localhost:3042', 'http://127.0.0.1:3042', 'https://api.intra.42.fr/oauth/authorize'], credentials: true, methods: "GET,HEAD,PUT,PATCH,POST,DELETE"});
  await app.listen(config.get('SERVER_PORT'));
  console.log(`Listening on port ${config.get('SERVER_PORT')}`);
}

bootstrap();
