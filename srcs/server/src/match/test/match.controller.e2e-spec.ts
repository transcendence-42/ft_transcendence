import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { mockUserDto } from 'src/user/test/stubs/mock.user.dto';
import { Match } from '../entities/match.entity';

describe('Match API e2e test', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userService: UserService;
  let mockP1: User;
  let mockP2: User;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    userService = moduleRef.get<UserService>(UserService);
    prisma = moduleRef.get<PrismaService>(PrismaService);
    await app.init();
  });

  beforeEach(async () => {
    await prisma.cleanDatabase();
    // create fresh users for match
    mockP1 = await userService.create(mockUserDto[0]);
    mockP2 = await userService.create(mockUserDto[1]);
  });

  describe('POST /matches', () => {
    it('should return 201 created if we successfully created the match', async () => {
      const result = await request(app.getHttpServer()).post('/matches').send({
        idPlayer1: mockP1.id,
        idPlayer2: mockP2.id,
      });
      expect(result.statusCode).toBe(201);
      expect(result.body).toMatchObject(Match.prototype);
    });
  });
});
