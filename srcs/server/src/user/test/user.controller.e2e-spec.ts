import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/user/entities/user.entity';
import {
  mockUserDto,
  mockUserUpdateDto,
} from 'src/user/test/stubs/mock.user.dto';
import { BaseApiException } from 'src/common/exceptions/baseApiException.entity';
import { Friendship } from 'src/generated/nestjs-dto/friendship.entity';
import { UserService } from '../user.service';
import { FriendshipService } from 'src/friendship/friendship.service';
import { RatingService } from 'src/rating/rating.service';
import { Rating } from '../entities/rating.entity';

describe('User API e2e test', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userService: UserService;
  let friendshipService: FriendshipService;
  let ratingService: RatingService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get<PrismaService>(PrismaService);
    userService = moduleRef.get<UserService>(UserService);
    friendshipService = moduleRef.get<FriendshipService>(FriendshipService);
    ratingService = moduleRef.get<RatingService>(RatingService);
    await app.init();
  });

  beforeEach(async () => {
    await prisma.cleanDatabase();
  });

  describe('POST /users', () => {
    it('should return 201 created if we successfully created the user', async () => {
      const result = await request(app.getHttpServer())
        .post('/users')
        .send(mockUserDto[0]);
      expect(result.statusCode).toBe(201);
      expect(result.body).toMatchObject(User.prototype);
    });

    it('should return 409 if user already exists', async () => {
      await request(app.getHttpServer()).post('/users').send(mockUserDto[0]);
      const result = await request(app.getHttpServer())
        .post('/users')
        .send(mockUserDto[0]);
      expect(result.statusCode).toBe(409);
      expect(result.body).toMatchObject(BaseApiException.prototype);
      expect(result.body.message).toBe(
        `User "${mockUserDto[0].username}" already exists`,
      );
    });
  });

  describe('GET /users', () => {
    beforeEach(async () => {
      await userService.create(mockUserDto[0]);
      await userService.create(mockUserDto[1]);
      await userService.create(mockUserDto[2]);
      await userService.create(mockUserDto[3]);
      await userService.create(mockUserDto[4]);
    });

    it('should return 200 and an array of users if successfull', async () => {
      const result = await request(app.getHttpServer()).get('/users');
      expect(result.statusCode).toBe(200);
      expect(result.body).toBeInstanceOf(Array);
      expect(result.body.length).toBe(5);
      result.body.forEach((user) => {
        expect(user).toMatchObject(User.prototype);
      });
    });

    it('should return 200 and a limited array of users with "limit" set', async () => {
      const result = await request(app.getHttpServer())
        .get('/users')
        .query({ limit: 3 });
      expect(result.statusCode).toBe(200);
      expect(result.body).toBeInstanceOf(Array);
      expect(result.body.length).toBe(3);
      result.body.forEach((user) => {
        expect(user).toMatchObject(User.prototype);
      });
    });

    it('should return 200 and an offseted array of users with "offset" set', async () => {
      const result = await request(app.getHttpServer())
        .get('/users')
        .query({ offset: 3 });
      expect(result.statusCode).toBe(200);
      expect(result.body).toBeInstanceOf(Array);
      expect(result.body.length).toBe(2);
      result.body.forEach((user) => {
        expect(user).toMatchObject(User.prototype);
      });
    });

    it('should return 200 and an offseted and limited array of users with "offset" and "limit" set', async () => {
      const result = await request(app.getHttpServer())
        .get('/users')
        .query({ offset: 1, limit: 3 });
      expect(result.statusCode).toBe(200);
      expect(result.body).toBeInstanceOf(Array);
      expect(result.body.length).toBe(3);
      result.body.forEach((user) => {
        expect(user).toMatchObject(User.prototype);
      });
    });

    it('should return 204 and an empty object if user table is empty', async () => {
      await prisma.cleanDatabase();
      const result = await request(app.getHttpServer()).get('/users');
      expect(result.statusCode).toBe(204);
      expect(result.body).toStrictEqual({});
    });
  });

  describe('GET /users/:id', () => {
    it('should return 200 and a User object if successfull', async () => {
      const user = await request(app.getHttpServer())
        .post('/users')
        .send(mockUserDto[0]);
      // get the user by id
      const result = await request(app.getHttpServer()).get(
        '/users/' + user.body.id,
      );
      expect(result.statusCode).toBe(200);
      expect(result.body).toMatchObject(User.prototype);
    });

    it('should return 404 if user not found', async () => {
      const result = await request(app.getHttpServer()).get('/users/' + 42);
      expect(result.statusCode).toBe(404);
      expect(result.body).toMatchObject(BaseApiException.prototype);
      expect(result.body.message).toBe(`User #42 not found`);
    });
  });

  describe('PATCH /users/:id', () => {
    it('should return 200 and a User object if successfull', async () => {
      // create a user
      const user = await request(app.getHttpServer())
        .post('/users')
        .send(mockUserDto[0]);
      // patch it, multiple configurations
      const result = await request(app.getHttpServer())
        .patch('/users/' + user.body.id)
        .send(mockUserUpdateDto[0]);
      expect(result.statusCode).toBe(200);
      expect(result.body).toMatchObject(User.prototype);
      const result1 = await request(app.getHttpServer())
        .patch('/users/' + user.body.id)
        .send(mockUserUpdateDto[1]);
      expect(result1.statusCode).toBe(200);
      expect(result1.body).toMatchObject(User.prototype);
      const result2 = await request(app.getHttpServer())
        .patch('/users/' + user.body.id)
        .send(mockUserUpdateDto[2]);
      expect(result2.statusCode).toBe(200);
      expect(result2.body).toMatchObject(User.prototype);
      const result3 = await request(app.getHttpServer())
        .patch('/users/' + user.body.id)
        .send(mockUserUpdateDto[3]);
      expect(result3.statusCode).toBe(200);
      expect(result3.body).toMatchObject(User.prototype);
      const result4 = await request(app.getHttpServer())
        .patch('/users/' + user.body.id)
        .send(mockUserUpdateDto[4]);
      expect(result4.statusCode).toBe(200);
      expect(result4.body).toMatchObject(User.prototype);
      const result5 = await request(app.getHttpServer())
        .patch('/users/' + user.body.id)
        .send(mockUserUpdateDto[5]);
      expect(result5.statusCode).toBe(200);
      expect(result5.body).toMatchObject(User.prototype);
      const result6 = await request(app.getHttpServer())
        .patch('/users/' + user.body.id)
        .send(mockUserUpdateDto[6]);
      expect(result6.statusCode).toBe(200);
      expect(result6.body).toMatchObject(User.prototype);
      const result7 = await request(app.getHttpServer())
        .patch('/users/' + user.body.id)
        .send(mockUserUpdateDto[7]);
      expect(result7.statusCode).toBe(200);
      expect(result7.body).toMatchObject(User.prototype);
    });

		it('should return 200 and a "BadRequestException" if name unicity constraint is violated', async () => {
			// create 2 users
      const user = await request(app.getHttpServer())
        .post('/users')
        .send(mockUserDto[0]);
			const user1 = await request(app.getHttpServer())
        .post('/users')
        .send(mockUserDto[1]);
      // patch one user to get the seconc user's name
      const result = await request(app.getHttpServer())
        .patch('/users/' + user1.body.id)
        .send({ username: mockUserDto[0].username });
      expect(result.statusCode).toBe(200);
      expect(result.body).toMatchObject(BaseApiException.prototype);
      expect(result.body.message).toBe(`Bad request`);
    });

		it('should return 200 and a "BadRequestException" if email unicity constraint is violated', async () => {
			// create 2 users
      const user = await request(app.getHttpServer())
        .post('/users')
        .send(mockUserDto[0]);
			const user1 = await request(app.getHttpServer())
        .post('/users')
        .send(mockUserDto[1]);
      // patch one user to get the seconc user's name
      const result = await request(app.getHttpServer())
        .patch('/users/' + user1.body.id)
        .send({ email: mockUserDto[0].email });
      expect(result.statusCode).toBe(200);
      expect(result.body).toMatchObject(BaseApiException.prototype);
      expect(result.body.message).toBe(`Bad request`);
    });

    it('should return 404 if user not found', async () => {
      const result = await request(app.getHttpServer())
        .patch('/users/' + 42)
        .send(mockUserUpdateDto[0]);
      expect(result.statusCode).toBe(404);
      expect(result.body).toMatchObject(BaseApiException.prototype);
      expect(result.body.message).toBe(`User #42 not found`);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should return 200 and a User object if successfull', async () => {
      const user = await request(app.getHttpServer())
        .post('/users')
        .send(mockUserDto[0]);
      // delete the user by id
      const result = await request(app.getHttpServer()).delete(
        '/users/' + user.body.id,
      );
      expect(result.statusCode).toBe(200);
      expect(result.body).toMatchObject(User.prototype);
      // Search the user by id should return 404
      const resultAfter = await request(app.getHttpServer()).get(
        '/users/' + user.body.id,
      );
      expect(resultAfter.statusCode).toBe(404);
      expect(resultAfter.body).toMatchObject(BaseApiException.prototype);
      expect(resultAfter.body.message).toBe(`User #${user.body.id} not found`);
    });

    it('should return 404 if user not found', async () => {
      const result = await request(app.getHttpServer()).delete('/users/' + 42);
      expect(result.statusCode).toBe(404);
      expect(result.body).toMatchObject(BaseApiException.prototype);
      expect(result.body.message).toBe(`User #42 not found`);
    });
  });

  describe('PUT /users/:id/friends', () => {
    let user1: User;
    let user2: User;

    beforeEach(async () => {
      user1 = await userService.create(mockUserDto[0]);
      user2 = await userService.create(mockUserDto[1]);
    });

    it('should return 200 and Friendship objects if successfull', async () => {
      // user1 request user2 to be his friend
      const result = await request(app.getHttpServer())
        .put('/users/' + user1.id + '/friends')
        .send({ addresseeId: +user2.id });
      expect(result.statusCode).toBe(200);
      expect(result.body).toMatchObject(Friendship.prototype);
    });

    it('should return 200 and specific message if friendship request already exist from the same requester ', async () => {
      // user1 request user2 to be his friend
      await request(app.getHttpServer())
        .put('/users/' + user1.id + '/friends')
        .send({ addresseeId: user2.id });
      // and again
      const result = await request(app.getHttpServer())
        .put('/users/' + user1.id + '/friends')
        .send({ addresseeId: user2.id });
      expect(result.statusCode).toBe(200);
      expect(result.body).toMatchObject(BaseApiException.prototype);
      expect(result.body.message).toBe(
        `User #${user1.id} has already requested to be friend with #${user2.id}`,
      );
    });

    it('should return 200 and specific message if friendship request already rejected before', async () => {
      // user1 request user2 to be his friend
      await request(app.getHttpServer())
        .put('/users/' + user1.id + '/friends')
        .send({ addresseeId: user2.id });
      // Update the friendship with status rejected
      await request(app.getHttpServer()).patch('/friendship').send({
        requesterId: user1.id,
        addresseeId: user2.id,
        status: 2,
      });
      // ask again
      const result = await request(app.getHttpServer())
        .put('/users/' + user1.id + '/friends')
        .send({ addresseeId: user2.id });
      expect(result.statusCode).toBe(200);
      expect(result.body).toMatchObject(BaseApiException.prototype);
      expect(result.body.message).toBe(
        `User #${user2.id} has already refused to be friend with #${user1.id}`,
      );
    });

    it('should return 404 if user not found', async () => {
      // create one user
      const user1 = await request(app.getHttpServer())
        .post('/users')
        .send(mockUserDto[0]);
      // user not existing asks user1 to be his friend
      const result = await request(app.getHttpServer())
        .put('/users/' + 42 + '/friends')
        .send({ addresseeId: user1.body.id });
      expect(result.statusCode).toBe(404);
      expect(result.body).toMatchObject(BaseApiException.prototype);
      expect(result.body.message).toBe(`User #42 not found`);
    });
  });

  describe('GET /users/:id/friends', () => {
    let user1: User;
    let user2: User;
    let user3: User;
    let user4: User;
    let user5: User;

    beforeEach(async () => {
      // create few users
      user1 = await userService.create(mockUserDto[0]);
      user2 = await userService.create(mockUserDto[1]);
      user3 = await userService.create(mockUserDto[2]);
      user4 = await userService.create(mockUserDto[3]);
      user5 = await userService.create(mockUserDto[4]);

      // add all as friends of the first one
      await userService.requestFriendship(user1.id, {
        addresseeId: user2.id,
      });
      await userService.requestFriendship(user1.id, {
        addresseeId: user3.id,
      });
      await userService.requestFriendship(user1.id, {
        addresseeId: user4.id,
      });
      await userService.requestFriendship(user1.id, {
        addresseeId: user5.id,
      });

      // accept all friendships
      await friendshipService.update({
        requesterId: user1.id,
        addresseeId: user2.id,
        status: 1,
      });
      await friendshipService.update({
        requesterId: user1.id,
        addresseeId: user3.id,
        status: 1,
      });
      await friendshipService.update({
        requesterId: user1.id,
        addresseeId: user4.id,
        status: 1,
      });
      await friendshipService.update({
        requesterId: user1.id,
        addresseeId: user5.id,
        status: 1,
      });
    });

    it('should return 200 and an array of users if successfull', async () => {
      // get all
      const result = await request(app.getHttpServer()).get(
        '/users/' + user1.id + '/friends',
      );
      expect(result.statusCode).toBe(200);
      expect(result.body).toBeInstanceOf(Array);
      expect(result.body.length).toBe(4);
      result.body.forEach((user) => {
        expect(user).toMatchObject(User.prototype);
      });
    });

    it('should return 200 and a limited array of users with "limit" set', async () => {
      // get all
      const result = await request(app.getHttpServer())
        .get('/users/' + user1.id + '/friends')
        .query({ limit: 2 });
      expect(result.statusCode).toBe(200);
      expect(result.body).toBeInstanceOf(Array);
      expect(result.body.length).toBe(2);
      result.body.forEach((user) => {
        expect(user).toMatchObject(User.prototype);
      });
    });

    it('should return 200 and an offseted array of users with "offset" set', async () => {
      // get all
      const result = await request(app.getHttpServer())
        .get('/users/' + user1.id + '/friends')
        .query({ offset: 3 });
      expect(result.statusCode).toBe(200);
      expect(result.body).toBeInstanceOf(Array);
      expect(result.body.length).toBe(1);
      result.body.forEach((user) => {
        expect(user).toMatchObject(User.prototype);
      });
    });

    it('should return 200 and an offseted and limited array of users with "offset" and "limit" set', async () => {
      // get all
      const result = await request(app.getHttpServer())
        .get('/users/' + user1.id + '/friends')
        .query({ offset: 2, limit: 1 });
      expect(result.statusCode).toBe(200);
      expect(result.body).toBeInstanceOf(Array);
      expect(result.body.length).toBe(1);
      result.body.forEach((user) => {
        expect(user).toMatchObject(User.prototype);
      });
    });

    it('should return 204 and an empty object if user table is empty', async () => {
      // create a new user
      const user6 = await request(app.getHttpServer())
        .post('/users')
        .send(mockUserDto[5]);
      const result = await request(app.getHttpServer()).get(
        '/users/' + user6.body.id + '/friends',
      );
      expect(result.statusCode).toBe(204);
      expect(result.body).toStrictEqual({});
    });

    it('should return 404 if user not found', async () => {
      // user not existing asks user1 to be his friend
      const result = await request(app.getHttpServer()).get(
        '/users/' + (+user5.id + 42) + '/friends',
      );
      expect(result.statusCode).toBe(404);
      expect(result.body).toMatchObject(BaseApiException.prototype);
      expect(result.body.message).toBe(`User #${+user5.id + 42} not found`);
    });
  });

  describe('GET /users/:id/ratings', () => {
    let user: User;

    beforeEach(async () => {
      // create a user
      user = await userService.create(mockUserDto[0]);

      // add some ratings
      await ratingService.create({ userId: user.id, rating: 1111 });
      await ratingService.create({ userId: user.id, rating: 2222 });
      await ratingService.create({ userId: user.id, rating: 3333 });
      await ratingService.create({ userId: user.id, rating: 4444 });
      await ratingService.create({ userId: user.id, rating: 5555 });
      await ratingService.create({ userId: user.id, rating: 6666 });
    });

    it('should return 200 and an array of ratings if successfull', async () => {
      // get all
      const result = await request(app.getHttpServer()).get(
        '/users/' + user.id + '/ratings',
      );
      expect(result.statusCode).toBe(200);
      expect(result.body).toBeInstanceOf(Array);
      expect(result.body.length).toBe(7);
      result.body.forEach((rating) => {
        expect(rating).toMatchObject(Rating.prototype);
      });
    });

    it('should return 200 and a limited array of ratings with "limit" set', async () => {
      // get all
      const result = await request(app.getHttpServer())
        .get('/users/' + user.id + '/ratings')
        .query({ limit: 2 });
      expect(result.statusCode).toBe(200);
      expect(result.body).toBeInstanceOf(Array);
      expect(result.body.length).toBe(2);
      result.body.forEach((rating) => {
        expect(rating).toMatchObject(Rating.prototype);
      });
    });

    it('should return 200 and an offseted array of ratings with "offset" set', async () => {
      // get all
      const result = await request(app.getHttpServer())
        .get('/users/' + user.id + '/ratings')
        .query({ offset: 3 });
      expect(result.statusCode).toBe(200);
      expect(result.body).toBeInstanceOf(Array);
      expect(result.body.length).toBe(4);
      result.body.forEach((rating) => {
        expect(rating).toMatchObject(Rating.prototype);
      });
    });

    it('should return 200 and an offseted and limited array of ratings with "offset" and "limit" set', async () => {
      // get all
      const result = await request(app.getHttpServer())
        .get('/users/' + user.id + '/ratings')
        .query({ offset: 2, limit: 1 });
      expect(result.statusCode).toBe(200);
      expect(result.body).toBeInstanceOf(Array);
      expect(result.body.length).toBe(1);
      result.body.forEach((rating) => {
        expect(rating).toMatchObject(Rating.prototype);
      });
    });

    it('should return 404 if user not found', async () => {
      // user not existing asks user1 to be his friend
      const result = await request(app.getHttpServer()).get(
        '/users/' + (+user.id + 42) + '/ratings',
      );
      expect(result.statusCode).toBe(404);
      expect(result.body).toMatchObject(BaseApiException.prototype);
      expect(result.body.message).toBe(`User #${+user.id + 42} not found`);
    });
  });
});
