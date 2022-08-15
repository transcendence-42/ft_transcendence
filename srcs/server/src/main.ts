import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as Session from 'express-session';
import * as Passport from 'passport';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new ConfigService();

  app.use(
    Session({
      saveUninitialized: false,
      secret: config.get('SESSION_SECRET'),
      resave: false,
      name: 'auth_session',
      cookie: {
        maxAge: 6000 * 60 * 24 * 30 * 3, // 3 months
      },
    }),
  );
  app.use(Passport.initialize());
  app.use(Passport.session());
  await app.listen(3333);
}

bootstrap();
