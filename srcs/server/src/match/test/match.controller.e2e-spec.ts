import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { mockUserDto } from 'src/user/test/stubs/mock.user.dto';
import { Match } from '../entities/match.entity';
import { BaseApiException } from 'src/common/exceptions/baseApiException.entity';
import { createMockMatchesDto } from './stubs/mock.match.dto';

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

  afterAll(async () => {
    await prisma.cleanDatabase();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.cleanDatabase();
    // create fresh users for match
    mockP1 = await userService.create(mockUserDto[0]);
    mockP2 = await userService.create(mockUserDto[1]);
  });

  describe('POST /matches', () => {
    it('should return 201 created if we successfully created the match', async () => {
      const result = await request(app.getHttpServer())
        .post('/matches')
        .send(createMockMatchesDto(mockP1.id, mockP2.id)[0]);
      expect(result.statusCode).toBe(201);
      expect(result.body).toMatchObject(Match.prototype);
    });

    it('should return 400 bad request with only one player', async () => {
      const result = await request(app.getHttpServer())
        .post('/matches')
        .send(createMockMatchesDto(mockP1.id, mockP2.id)[1]);
      expect(result.statusCode).toBe(400);
      expect(result.body).toMatchObject(BaseApiException.prototype);
      expect(result.body.message).toBe(
        `You need at least 2 players to create a match`,
      );
    });

    it('should return 400 bad request with 2 players on the same side', async () => {
      const result = await request(app.getHttpServer())
        .post('/matches')
        .send(createMockMatchesDto(mockP1.id, mockP2.id)[3]);
      expect(result.statusCode).toBe(400);
      expect(result.body).toMatchObject(BaseApiException.prototype);
      expect(result.body.message).toBe(
        `The request payload is not as expected`,
      );
    });

    it('should return 400 bad request with 2 players with the same status', async () => {
      const result = await request(app.getHttpServer())
        .post('/matches')
        .send(createMockMatchesDto(mockP1.id, mockP2.id)[3]);
      expect(result.statusCode).toBe(400);
      expect(result.body).toMatchObject(BaseApiException.prototype);
      expect(result.body.message).toBe(
        `The request payload is not as expected`,
      );
    });

    it('should return 400 bad request with a wrong status', async () => {
      const result = await request(app.getHttpServer())
        .post('/matches')
        .send(createMockMatchesDto(mockP1.id, mockP2.id)[6]);
      expect(result.statusCode).toBe(400);
      expect(result.body).toMatchObject(BaseApiException.prototype);
      expect(result.body.message).toBe(
        `The request payload is not as expected`,
      );
    });

    it('should return 404 and a specific message if a player is not found', async () => {
      const result = await request(app.getHttpServer())
        .post('/matches')
        .send(createMockMatchesDto(mockP1.id, mockP2.id)[2]);
      expect(result.statusCode).toBe(404);
      expect(result.body).toMatchObject(BaseApiException.prototype);
      expect(result.body.message).toBe(`User #666 not found`);
    });
  });

  describe('GET /matches', () => {
    it('should return 200 and a Match array if successfull', async () => {
      // create a match to not have 204 statusCode
      await request(app.getHttpServer())
        .post('/matches')
        .send(createMockMatchesDto(mockP1.id, mockP2.id)[0]);
      // get all
      const result = await request(app.getHttpServer()).get('/matches');
      expect(result.statusCode).toBe(200);
      expect(result.body).toBeInstanceOf(Array);
      result.body.forEach((match) => {
        expect(match).toMatchObject(Match.prototype);
      });
    });

    it('should return 204 and an empty body if there is no match in database', async () => {
      const result = await request(app.getHttpServer()).get('/matches');
      expect(result.statusCode).toBe(204);
      expect(result.body).toStrictEqual({});
    });
  });

  describe('GET /matches/:id', () => {
    it('should return 200 and a Match object if successfull', async () => {
      // create a match
      const createdMatch = await request(app.getHttpServer())
        .post('/matches')
        .send(createMockMatchesDto(mockP1.id, mockP2.id)[0]);
      // get the match by id
      const result = await request(app.getHttpServer()).get(
        '/matches/' + createdMatch.body.id,
      );
      expect(result.statusCode).toBe(200);
      expect(result.body).toMatchObject(Match.prototype);
    });

    it('should return 404 and a specific message if the match is not found', async () => {
      const fakeId = 42;
      const result = await request(app.getHttpServer()).get(
        '/matches/' + fakeId,
      );
      expect(result.statusCode).toBe(404);
      expect(result.body).toMatchObject(BaseApiException.prototype);
      expect(result.body.message).toBe(`Match #${fakeId} not found`);
    });
  });

  describe('DELETE /matches/:id', () => {
    it('should return 200 and a Match object if successfull', async () => {
      // create a match
      const createdMatch = await request(app.getHttpServer())
        .post('/matches')
        .send(createMockMatchesDto(mockP1.id, mockP2.id)[0]);
      // delete the match by id
      const result = await request(app.getHttpServer()).delete(
        '/matches/' + createdMatch.body.id,
      );
      expect(result.statusCode).toBe(200);
      expect(result.body).toMatchObject(Match.prototype);
      // Search the match by id should return 404
      const resultAfter = await request(app.getHttpServer()).get(
        '/matches/' + createdMatch.body.id,
      );
      expect(resultAfter.statusCode).toBe(404);
      expect(resultAfter.body).toMatchObject(BaseApiException.prototype);
      expect(resultAfter.body.message).toBe(
        `Match #${createdMatch.body.id} not found`,
      );
    });

    it('should return 404 and a specific message if the match is not found', async () => {
      const fakeId = 42;
      const result = await request(app.getHttpServer()).get(
        '/matches/' + fakeId,
      );
      expect(result.statusCode).toBe(404);
      expect(result.body).toMatchObject(BaseApiException.prototype);
      expect(result.body.message).toBe(`Match #${fakeId} not found`);
    });
  });
});
