import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import * as request from 'supertest';
import { HttpServer } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { mockUserDto } from 'src/user/test/stubs/mock.user.dto';
import { CreateMatchDto } from '../dto/create-match.dto';
import { Match } from '../entities/match.entity';

describe('Match API e2e test', () => {
  let prisma: PrismaService;
  let userService: UserService;
  let httpServer: HttpServer;
  let mockP1: User;
  let mockP2: User;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleRef.createNestApplication();
    userService = moduleRef.get<UserService>(UserService);
    prisma = moduleRef.get<PrismaService>(PrismaService);
    httpServer = app.getHttpServer();
    await app.init();
  });

  beforeEach(async () => {
    await prisma.cleanDatabase();
    // create fresh users for match
    mockP1 = await userService.create(mockUserDto[0]);
    mockP2 = await userService.create(mockUserDto[1]);
  });

  function postMatchCreate(mock: CreateMatchDto) {
    return request(httpServer).post('/matches').send(mock);
  }

  describe('POST /matches', () => {
    it('should return 201 created if we successfully created the match', async () => {
      await prisma.user.findUnique({ where: { id: mockP1.id } });
      const response = await postMatchCreate({
        idPlayer1: mockP1.id,
        idPlayer2: mockP2.id,
      });
      console.log(response.body);
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual(expect.any(Match));
    });
  });
});
