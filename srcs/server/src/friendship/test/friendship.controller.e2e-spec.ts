import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { mockUserDto } from 'src/user/test/stubs/mock.user.dto';
import { BaseApiException } from 'src/common/exceptions/baseApiException.entity';
import { Friendship } from '../entities/friendship.entity';

describe('Frienship API e2e test', () => {
  let app: INestApplication;
  let httpServer: any;
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
    httpServer = app.getHttpServer();
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

  describe('DELETE /friendship', () => {
    it('should return 200 and a Friendship if we successfully deleted the friendship', async () => {
      // Create a friendship to delete
      await request(httpServer)
        .put('/users/' + mockP1.id + '/friends')
        .send({ addresseeId: mockP2.id });
      const result = await request(httpServer)
        .delete('/friendship')
        .send({ requesterId: mockP1.id, addresseeId: mockP2.id });
      expect(result.statusCode).toBe(200);
      expect(result.body).toMatchObject(Friendship.prototype);
    });

    it('should return 404 and a specific message if the friendship is not found', async () => {
      const result = await request(httpServer)
        .delete('/friendship')
        .send({ requesterId: mockP1.id, addresseeId: mockP2.id });
      expect(result.statusCode).toBe(404);
      expect(result.body).toMatchObject(BaseApiException.prototype);
      expect(result.body.message).toBe(
        `Friendship between #${mockP1.id} and #${mockP2.id} not found`,
      );
    });
  });

  describe('UPDATE /friendship', () => {
    it('should return 200 and a Friendship if we successfully updated the friendship', async () => {
      // Create a friendship to delete
      await request(httpServer)
        .put('/users/' + mockP1.id + '/friends')
        .send({ addresseeId: mockP2.id });
      const result = await request(httpServer)
        .patch('/friendship')
        .send({ requesterId: mockP1.id, addresseeId: mockP2.id, status: 2 });
      expect(result.statusCode).toBe(200);
      expect(result.body).toMatchObject(Friendship.prototype);
      expect(result.body.status).toBe(2);
    });

    it('should return 404 and a specific message if the friendship is not found', async () => {
      const result = await request(httpServer)
        .patch('/friendship')
        .send({ requesterId: mockP1.id, addresseeId: mockP2.id, status: 2 });
      expect(result.statusCode).toBe(404);
      expect(result.body).toMatchObject(BaseApiException.prototype);
      expect(result.body.message).toBe(
        `Friendship between #${mockP1.id} and #${mockP2.id} not found`,
      );
    });
  });
});
