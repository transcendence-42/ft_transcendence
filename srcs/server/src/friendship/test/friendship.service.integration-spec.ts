import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppModule } from 'src/app.module';
import { FriendshipService } from 'src/friendship/friendship.service';
import { CreateFriendshipDto } from 'src/user/dto/create-friendship.dto';
import { DeleteFriendshipDto } from '../dto/delete-friendship.dto';
import { FriendshipNotFoundException } from '../exceptions/';
import { UpdateFriendshipDto } from '../dto/update-friendship.dto';
import { Friendship } from '@prisma/client';
import { mockUserDto } from 'src/common/stubs/mock.user.dto';

describe('User service integration tests', () => {
  let userService: UserService;
  let friendshipService: FriendshipService;
  let prisma: PrismaService;

  // setup modules for test
  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    friendshipService = moduleRef.get<FriendshipService>(FriendshipService);
    prisma = moduleRef.get(PrismaService);
  });

  // Remove a friendship
  describe('Remove a friendship', () => {
    beforeEach(async () => {
      await prisma.cleanDatabase();
    });

    it('should remove an existing friendship', async () => {
      // create 2 users
      const { id: id1 } = await userService.create(mockUserDto[0]);
      const { id: id2 } = await userService.create(mockUserDto[1]);
      // friendship them
      const createFriendshipDto: CreateFriendshipDto = { addresseeId: id2 };
      await userService.createFriendship(id1, createFriendshipDto);
      // delete the friendship
      const deleteFriendshipDto: DeleteFriendshipDto = {
        requesterId: id1,
        addresseeId: id2,
      };
      await friendshipService.remove(deleteFriendshipDto);
      // validate that the friendship is not in the database anymore
      await expect(
        friendshipService.findOne(deleteFriendshipDto),
      ).rejects.toThrow(FriendshipNotFoundException);
    });

    it('should throw "FriendshipNotFoundException" when we try to remove a non existing friendship ', async () => {
      // delete a friendship by providing wrong ids
      const deleteFriendshipDto: DeleteFriendshipDto = {
        requesterId: 555,
        addresseeId: 83,
      };
      await expect(
        friendshipService.remove(deleteFriendshipDto),
      ).rejects.toThrow(FriendshipNotFoundException);
    });
  });

  // Update friendship
  describe('update friendship', () => {
    beforeEach(async () => {
      await prisma.cleanDatabase();
    });

    it('should update the status and the date of an existing friendship', async () => {
      // create 2 users
      const { id: id1 } = await userService.create(mockUserDto[0]);
      const { id: id2 } = await userService.create(mockUserDto[1]);
      // friendship them
      const createFriendshipDto: CreateFriendshipDto = { addresseeId: id2 };
      const initialFriendship = await userService.createFriendship(
        id1,
        createFriendshipDto,
      );
      // update the friendship
      const updateFriendshipDto: UpdateFriendshipDto = {
        requesterId: id1,
        addresseeId: id2,
        status: 2,
      };
      const updatedFriendship: Friendship = await friendshipService.update(
        updateFriendshipDto,
      );
      // checks
      expect(updatedFriendship.date).not.toBe(initialFriendship.date);
      expect(updatedFriendship.status).not.toBe(initialFriendship.status);
    });

    it('should throw "FriendshipNotFoundException" when we try to update a non existing friendship ', async () => {
      // delete a friendship by providing wrong ids
      const updateFriendshipDto: UpdateFriendshipDto = {
        requesterId: 555,
        addresseeId: 83,
        status: 2,
      };
      await expect(
        friendshipService.update(updateFriendshipDto),
      ).rejects.toThrow(FriendshipNotFoundException);
    });
  });
});
