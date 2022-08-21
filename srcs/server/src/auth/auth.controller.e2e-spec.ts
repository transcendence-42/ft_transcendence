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

  describe('POST auth/register', () => {});
  describe('POST auth/login', () => {
    it('should login a that is already registered', () => {});
    it('should return unauthorized when bad emai', () => {});
    it('should return unauthorized when bad password', () => {});
    it('should return ')
  })
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
