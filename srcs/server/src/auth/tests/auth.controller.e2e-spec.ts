import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthController } from '../auth.controller';
import * as request from 'supertest';
import { HttpServer } from '@nestjs/common';
import { mockValidRegisterUserDto } from 'src/common/stubs/mock.user.dto';

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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
