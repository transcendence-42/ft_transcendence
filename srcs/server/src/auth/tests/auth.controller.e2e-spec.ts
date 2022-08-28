import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthController } from '../auth.controller';
import * as request from 'supertest';
import { HttpServer } from '@nestjs/common';
import { mockValidRegisterUserDto } from 'src/user/test/stubs/mock.user.dto';

describe('AuthController e2e test', () => {
  let controller: AuthController;
  let prisma: PrismaService;
  let httpServer: HttpServer;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleRef.createNestApplication();
    controller = moduleRef.get<AuthController>(AuthController);
    prisma = moduleRef.get<PrismaService>(PrismaService);
    httpServer = app.getHttpServer();
    await app.init();
  });

  beforeEach(async () => {
    prisma.cleanDatabase();
  });

  describe('POST /auth/register/', () => {
    function postRegisterUser() {
      return request(httpServer)
        .post('/auth/register')
        .send(mockValidRegisterUserDto);
    }
    it('should return 201 created if we successfully created the user', async () => {
      const response = await postRegisterUser();
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        username: mockValidRegisterUserDto.username,
        email: mockValidRegisterUserDto.email,
      });
    });
    it.todo(
      'should return 200 ok if user is already in the database and a message saying user already exists if email',
    );
    it.todo(
      'should return 200 ok if user is already in the database and a message saying user already exists if username is taken',
    );
    it.todo(
      'should return 400 bad request if user is already in the database and a message saying user already exists if username is taken',
    );
  });

  describe('POST auth/login', () => {
    it.todo(
      'should return 200 ok and the user (class User) as JSON if the user is already registered',
    );
    it.todo(
      'should return 200 ok when bad email and a message saying bad credentials',
    );
    it.todo(
      'should return 200 ok when bad password and a message saying bad credentials',
    );
    it.todo('login user using valid session');
    it.todo('login user using invalid session');
  });
  describe('GET auth/logout', () => {
    it.todo('should return successful message if user has correct session');
    it.todo('should throw forbidden exception if user has wrong or no session');
  })

  describe('GET auth/2fa/generate', () => {
    it.todo('should generate Two Factor Code as a QR code if the user is'
            + ' logged in and has 2FA deactivated ');
    it.todo('should throw a Unauthorized Exception 2FA Already Activated if the user is '
            + 'logged in with 2FA activated');
    it.todo('should throw a Unaunthorized Exception User is already 2FA authenticated'
            + 'if the user is logged in with 2FA');
    it.todo('should throw a Forbidden Exception if the user is not logged in');
  });

  describe('POST auth/2fa/activate', () => {
    it.todo('should activate authentication in the user credentials table if'
    + ' the code is valid and the user is logged in');
    it.todo('should throw Unauthorized Exception Bad 2FA Code if the code is wrong');
    it.todo('should throw Forbidden Exception if the user is not logged in');
  });

  describe('POST auth/2fa/authenticate', () => {
    it.todo('should return 200 : Logged in with Two factor successfully!'
    + 'if correct 2fa code was supplied');
    it.todo('should throw Unauthorized Exception Bad 2FA Code if the code is wrong');
    it.todo('should throw Forbidden Exception if the user is not logged in');
  });
});
