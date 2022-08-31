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
import {
  createMockScoresDto,
  mockMatchUpdateDto,
} from './stubs/mock.match.dto';
import { UpdateScoresDto } from '../dto/update-scores.dto';

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

    it('should return 409 if a match already exists between the two players', async () => {
      await request(app.getHttpServer()).post('/matches').send({
        idPlayer1: mockP1.id,
        idPlayer2: mockP2.id,
      });
      const result2 = await request(app.getHttpServer()).post('/matches').send({
        idPlayer1: mockP1.id,
        idPlayer2: mockP2.id,
      });
      const result3 = await request(app.getHttpServer()).post('/matches').send({
        idPlayer1: mockP2.id,
        idPlayer2: mockP1.id,
      });
      expect(result2.statusCode).toBe(409);
      expect(result2.body).toMatchObject(BaseApiException.prototype);
      expect(result2.body.message).toBe(
        'The match you try to create already exists',
      );
      expect(result3.statusCode).toBe(409);
      expect(result3.body).toMatchObject(BaseApiException.prototype);
      expect(result3.body.message).toBe(
        'The match you try to create already exists',
      );
    });

    it('should return 400 and a specific message if player1 == player2', async () => {
      const result = await request(app.getHttpServer()).post('/matches').send({
        idPlayer1: mockP1.id,
        idPlayer2: mockP1.id,
      });
      expect(result.statusCode).toBe(400);
      expect(result.body).toMatchObject(BaseApiException.prototype);
      expect(result.body.message).toBe(
        'You can only create a match with two different players',
      );
    });

    it('should return 404 and a specific message if a player is not found', async () => {
      const result = await request(app.getHttpServer()).post('/matches').send({
        idPlayer1: mockP1.id,
        idPlayer2: 666,
      });
      expect(result.statusCode).toBe(404);
      expect(result.body).toMatchObject(BaseApiException.prototype);
      expect(result.body.message).toBe(`User #666 not found`);
    });

    it('should return 200 and a specific message if a user is not available', async () => {
      // Make a user away
      await request(app.getHttpServer())
        .patch('/users/' + mockP1.id)
        .send({ currentStatus: userService.userStatus.AWAY });
      // try to create a new match
      const result = await request(app.getHttpServer()).post('/matches').send({
        idPlayer1: mockP1.id,
        idPlayer2: mockP2.id,
      });
      expect(result.statusCode).toBe(200);
      expect(result.body).toMatchObject(BaseApiException.prototype);
      expect(result.body.message).toBe(
        'At least one of the player is not available to play',
      );
    });
  });

  describe('GET /matches', () => {
    it('should return 200 and a Match array if successfull', async () => {
      // create a match to not have 204 statusCode
      await request(app.getHttpServer()).post('/matches').send({
        idPlayer1: mockP1.id,
        idPlayer2: mockP2.id,
      });
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
        .send({
          idPlayer1: mockP1.id,
          idPlayer2: mockP2.id,
        });
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

  describe('PATCH /matches/:id', () => {
    it('should return 200 and a Match object if successfull', async () => {
      // create a match
      const createdMatch = await request(app.getHttpServer())
        .post('/matches')
        .send({
          idPlayer1: mockP1.id,
          idPlayer2: mockP2.id,
        });
      // patch the match by id
      const result = await request(app.getHttpServer())
        .patch('/matches/' + createdMatch.body.id)
        .send(mockMatchUpdateDto[1]);
      expect(result.statusCode).toBe(200);
      expect(result.body).toMatchObject(Match.prototype);
      expect(result.body.status).toBe(mockMatchUpdateDto[1].status);
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

  describe('PATCH /matches/:id/scores', () => {
    let mockScores: UpdateScoresDto[];

    beforeEach(() => {
      mockScores = createMockScoresDto(mockP1.id, mockP2.id);
    });

    it('should return 200 and a Match object if successfull', async () => {
      // create a match
      const createdMatch = await request(app.getHttpServer())
        .post('/matches')
        .send({
          idPlayer1: mockP1.id,
          idPlayer2: mockP2.id,
        });
      // Update 2 players
      const result = await request(app.getHttpServer())
        .patch('/matches/' + createdMatch.body.id + '/scores')
        .send(mockScores[0]);
      expect(result.statusCode).toBe(200);
      expect(result.body).toMatchObject(Match.prototype);
      // Update 1 player
      const result2 = await request(app.getHttpServer())
        .patch('/matches/' + createdMatch.body.id + '/scores')
        .send(mockScores[1]);
      expect(result2.statusCode).toBe(200);
      expect(result2.body).toMatchObject(Match.prototype);
    });

    it('should return 200 and a Match object if one user is not found (just no score update for him)', async () => {
      // create a match
      const createdMatch = await request(app.getHttpServer())
        .post('/matches')
        .send({
          idPlayer1: mockP1.id,
          idPlayer2: mockP2.id,
        });
      // Update 2 players with the first unknown
      const result = await request(app.getHttpServer())
        .patch('/matches/' + createdMatch.body.id + '/scores')
        .send(mockScores[2]);
      expect(result.statusCode).toBe(200);
      expect(result.body).toMatchObject(Match.prototype);
      // Update 2 players with the second unknown
      const result2 = await request(app.getHttpServer())
        .patch('/matches/' + createdMatch.body.id + '/scores')
        .send(mockScores[3]);
      expect(result2.statusCode).toBe(200);
      expect(result2.body).toMatchObject(Match.prototype);
      // Update 2 players with both unknown
      const result3 = await request(app.getHttpServer())
        .patch('/matches/' + createdMatch.body.id + '/scores')
        .send(mockScores[4]);
      expect(result3.statusCode).toBe(200);
      expect(result3.body).toMatchObject(Match.prototype);
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
        .send({
          idPlayer1: mockP1.id,
          idPlayer2: mockP2.id,
        });
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
