import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthController } from './auth.controller';

describe('AuthController e2e test', () => {
  let controller: AuthController;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    prisma = module.get<PrismaService>(PrismaService);
    prisma.cleanDatabase();
  });

  describe('POST auth/register', () => {
    it('should return 201 created if we successfully created the user', () => {});
    it('should return 200 ok if user is already in the database and a message saying user already exists if email ', () => {});
    it('should return 200 ok if user is already in the database and a message saying user already exists if username is taken', () => {});
    it('should return 400 bad request if user is already in the database and a message saying user already exists if username is taken', () => {});
  });

  describe('POST auth/login', () => {
    it('should return 200 ok and the user (class User) as JSON if the user is already registered', () => {});
    it('should return 200 ok when bad email and a message saying bad credentials', () => {});
    it('should return 200 ok when bad password and a message saying bad credentials', () => {});
    todo('login user using valid session');
    todo('login user using invalid session');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
