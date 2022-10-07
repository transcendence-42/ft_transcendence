import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as Session from 'express-session';
import * as Passport from 'passport';
import { ConfigService } from '@nestjs/config';
import * as Redis from 'redis';
import * as ConnectRedis from 'connect-redis';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  console.debug = function () {
    return;
  }; // used to silence console.debugs
  // Create app
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Global prefix
  app.setGlobalPrefix('api');

  // Redis store
  const redisClient = Redis.createClient({
    url: config.get('REDIS_URL'),
    legacyMode: true,
  }) as any;
  const redisStore = await ConnectRedis(Session);
  redisClient.connect();
  redisClient.on('connect', () => {
    console.debug('\x1b[32m%s\x1b[0m', 'Connected to', 'Redis');
  });

  // DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // do not handle properties not defined in dto
      transform: true, // transform payloads to dto instances
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Secure HTTP Headers
  app.use(helmet());

  // Custom webSocket with port depending on environment file
  //app.useWebSocketAdapter(new SocketIoAdapter(app, config));

  // For Swagger UI
  const options = new DocumentBuilder()
    .setTitle('Transcendence API')
    .setDescription('The transcendence API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/', app, document);

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
  app.enableCors({
    origin: [config.get('WEBSITE_URL')],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  await app.listen(config.get('SERVER_PORT'));
  console.debug(
    '\x1b[32m%s\x1b[0m',
    'Listening on port:',
    config.get('SERVER_PORT'),
  );
}
bootstrap();
