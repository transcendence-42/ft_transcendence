import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppModule } from 'src/app.module';
import { Rating, User } from '@prisma/client';
import { UserNotFoundException } from 'src/user/exceptions/';
import { mockUserDto } from 'src/user/test/stubs/mock.user.dto';
import { RatingService } from '../rating.service';

describe('User service integration tests', () => {
  let userService: UserService;
  let ratingService: RatingService;
  let prisma: PrismaService;

  // setup modules for test
  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    ratingService = moduleRef.get<RatingService>(RatingService);
    prisma = moduleRef.get(PrismaService);
  });

  // Create user
  describe('create rating', () => {
    beforeEach(async () => {
      await prisma.cleanDatabase();
    });

    it('should create a new entry in rating collection of a user', async () => {
      // create a user
      const user: User = await userService.create(mockUserDto[0]);
      // create a new rating for this user
      const rating: Rating = await ratingService.create({
        rating: 2000,
        userId: user.id,
      });
      expect(rating.date).toBeDefined();
      expect(rating.id).toBeDefined();
      expect(rating.userId).toBe(user.id);
      expect(rating.rating).toBe(2000);
    });

    it('should throw a "UserNotFoundException" if user is not found', async () => {
      // create a user
      const user: User = await userService.create(mockUserDto[0]);
      await expect(
        ratingService.create({
          rating: 2000,
          userId: user.id + 42,
        }),
      ).rejects.toThrow(UserNotFoundException);
    });
  });
});
