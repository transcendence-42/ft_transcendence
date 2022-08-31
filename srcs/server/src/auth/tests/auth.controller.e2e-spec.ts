import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthController } from '../auth.controller';
import * as request from 'supertest';
import { HttpServer } from '@nestjs/common';
import { LocalLoginUserDto, LocalRegisterUserDto } from '../dto';
import {
  invalidEmailLoginUserInfo,
  invalidPwdLoginUserInfo,
  mockLoginUserInfo,
  mockRegisterUserInfo,
  mockRegisterUserInfoDiffEmail,
  mockRegisterUserInfoDiffUsername,
} from './mock.user.dto';
import { ConfigService } from '@nestjs/config';
import * as Session from 'express-session';
import * as Passport from 'passport';
import * as Redis from 'redis';
import * as ConnectRedis from 'connect-redis';
import { stat } from 'fs';
import { User } from 'src/user/entities/user.entity';

describe('AuthController e2e test', () => {
  let controller: AuthController;
  let prisma: PrismaService;
  let httpServer: HttpServer;
  let config: ConfigService;
  let redisClient;
  let app;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleRef.createNestApplication();
    config = app.get(ConfigService);
    redisClient = Redis.createClient({
      url: config.get('REDIS_URL'),
      legacyMode: true,
    }) as any;
    const redisStore = await ConnectRedis(Session);
    await redisClient.connect();
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
    controller = moduleRef.get<AuthController>(AuthController);
    prisma = moduleRef.get<PrismaService>(PrismaService);
    httpServer = app.getHttpServer();
    await app.init();
  });

  beforeEach(async () => {
    await redisClient.flushall('ASYNC');
    await prisma.cleanDatabase();
  });

  afterAll(async () => {
    await redisClient.disconnect();
  });

  function postRegisterUser(mock: LocalRegisterUserDto) {
    return request(httpServer).post('/auth/local/register').send(mock);
  }
  function postLoginUser(mock: LocalLoginUserDto) {
    return request(httpServer).post('/auth/local/login').send(mock);
  }
  function makeGet(path: string, session?: string) {
    if (session) return request(httpServer).get(path).set('Cookie', session);
    else return request(httpServer).get(path);
  }
  async function createUserAndLogIn(): Promise<string> {
    const created = await postRegisterUser(mockRegisterUserInfo);
    expect(created.statusCode).toBe(201);
    expect(created.body.message).toMatch('Account created successfully!');
    const logged = await postLoginUser(mockLoginUserInfo);
    expect(logged.statusCode).toBe(302);
    expect(logged.header['set-cookie'][0]).toBeDefined();
    return logged.header['set-cookie'][0];
  }

  describe('POST /auth/local/register/', () => {
    it('should return 201 created if we successfully created the user', async () => {
      const response = await postRegisterUser(mockRegisterUserInfo);
      expect(response.statusCode).toBe(201);
      expect(response.body.message).toMatch('Account created successfully!');
    });
    it('should throw a User Already Exists Exception if the same username but a different email is used', async () => {
      /* create our user first, then attempt to create it a second time to fail */
      const response1 = await postRegisterUser(mockRegisterUserInfo);
      expect(response1.statusCode).toBe(201);
      expect(response1.body.message).toMatch('Account created successfully!');
      const response2 = await postRegisterUser(mockRegisterUserInfoDiffEmail);
      expect(response2.statusCode).toBe(409);
      expect(response2.body.message).toBe(
        `User \"${mockRegisterUserInfoDiffEmail.username}\" already exists`,
      );
    });
    it('should throw a User Already Exists Exception if the same email but a different username is used', async () => {
      /* create our user first, then attempt to create it a second time to fail */
      const response1 = await postRegisterUser(mockRegisterUserInfo);
      expect(response1.statusCode).toBe(201);
      expect(response1.body.message).toMatch('Account created successfully!');

      const response2 = await postRegisterUser(
        mockRegisterUserInfoDiffUsername,
      );
      expect(response2.statusCode).toBe(409);
      expect(response2.body.message).toBe(
        `User \"${mockRegisterUserInfoDiffUsername.email}\" already exists`,
      );
    });
  });

  describe('POST auth/local/login', () => {
    it('should return 200 ok and the user (class User) as JSON if the user is already registered', async () => {
      const created = await postRegisterUser(mockRegisterUserInfo);
      expect(created.statusCode).toBe(201);
      expect(created.body.message).toMatch('Account created successfully!');
      const logged = await postLoginUser(mockLoginUserInfo);
      expect(logged.statusCode).toBe(302);
      expect(logged.header['set-cookie'][0]).toBeDefined();
    });
    it('should return 401 Unauthorized when bad email and a message saying bad credentials', async () => {
      const created = await postRegisterUser(mockRegisterUserInfo);
      expect(created.statusCode).toBe(201);
      expect(created.body.message).toMatch('Account created successfully!');
      const logged = await postLoginUser(invalidEmailLoginUserInfo);
      expect(logged.statusCode).toBe(401);
      expect(logged.body.message).toBe('Bad credentials');
    });
    it('should return 401 Unauthorized when bad password and a message saying bad credentials', async () => {
      const created = await postRegisterUser(mockRegisterUserInfo);
      expect(created.statusCode).toBe(201);
      expect(created.body.message).toMatch('Account created successfully!');
      const logged = await postLoginUser(invalidPwdLoginUserInfo);
      expect(logged.statusCode).toBe(401);
      expect(logged.body.message).toBe('Bad credentials');
    });
  });
  describe('GET auth/success', () => {
    const path = '/auth/success';
    it('should return user data associated with the auth session', async () => {
      const session = await createUserAndLogIn();
      const response = await makeGet(path, session);
      expect(response.statusCode).toBe(200);
      expect(response.body.user.email).toBe(mockLoginUserInfo.email);
      expect(response.body.user.id).toBeDefined();
    }),
    it('should return 403 forbidden ressources if no session', async () => {
      await createUserAndLogIn();
      const response = await makeGet(path);
      expect(response.statusCode).toBe(403);
      expect(response.body.message).toBe('Forbidden resource');
    })
  });
  describe('GET auth/logout', () => {
    function getLogout(sessionCookie: string) {
      return request(httpServer)
        .get('/auth/logout')
        .set('Cookie', sessionCookie);
    }
    it('should return successful message if user has correct session', async () => {
      const created = await postRegisterUser(mockRegisterUserInfo);
      expect(created.statusCode).toBe(201);
      expect(created.body.message).toMatch('Account created successfully!');
      const logged = await postLoginUser(mockLoginUserInfo);
      expect(logged.statusCode).toBe(302);
      expect(logged.header['set-cookie'][0]).toBeDefined();

      const session = logged.header['set-cookie'][0];
      const logout = await getLogout(session);
      expect(logout.statusCode).toBe(200);
      expect(logout.body.message).toBe('user logged-out successfuly');
    });
    it('should throw forbidden exception if user has wrong', async () => {
      const created = await postRegisterUser(mockRegisterUserInfo);
      expect(created.statusCode).toBe(201);
      expect(created.body.message).toMatch('Account created successfully!');
      const logged = await postLoginUser(mockLoginUserInfo);
      expect(logged.statusCode).toBe(302);
      expect(logged.header['set-cookie'][0]).toBeDefined();

      const logout = await getLogout('');
      expect(logout.statusCode).toBe(403);
      expect(logout.body.message).toBe('Forbidden resource');
    });
  });

  describe('GET auth/2fa/generate', () => {
    const path = '/auth/2fa/generate';
    it(
      'should generate Two Factor Code as a QR code if the user is' +
        ' logged in and has 2FA deactivated ',
      async () => {
        const userSession = await createUserAndLogIn();
        const response = await makeGet(path, userSession);
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();
      },
    );
    it('should throw a Forbidden Exception user is not logged in ', async () => {
      const userSession = await createUserAndLogIn();
      const response = await makeGet(path);
      expect(response.statusCode).toBe(403);
      expect(response.body.message).toBe('Forbidden resource');
    });
  });
});
