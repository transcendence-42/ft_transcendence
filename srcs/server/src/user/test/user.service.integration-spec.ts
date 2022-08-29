import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppModule } from 'src/app.module';
import { CreateUserDto } from '../dto/create-user.dto';
import { Friendship, User } from '@prisma/client';
import {
  NoUsersInDatabaseException,
  UserAlreadyExistsException,
  UserNotFoundException,
} from '../exceptions/user-exceptions';
import { UpdateUserDto } from '../dto/update-user.dto';
import { mockUserDto } from 'src/common/stubs/mock.user.dto';
import { CreateFriendshipDto } from '../dto/create-friendship.dto';
import {
  FriendshipAlreadyExistsException,
  FriendshipRejectedException,
  FriendshipRequestedException,
} from 'src/friendship/exceptions/friendship-exceptions';
import { UpdateFriendshipDto } from 'src/friendship/dto/update-friendship.dto';
import { FriendshipService } from 'src/friendship/friendship.service';

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

  // Create user
  describe('create user', () => {
    beforeEach(async () => {
      await prisma.cleanDatabase();
    });

    it('should create a new user with only required information', async () => {
      const data: CreateUserDto = {
        username: mockUserDto.username,
        email: mockUserDto.email,
      };
      const response: User = await userService.create(data);
      expect(response.id).toBeDefined();
      expect(response.createdAt).toBeDefined();
      expect(response.currentLadder).toBe(0);
      expect(response.currentStatus).toBe(0);
      expect(response.profilePicture).toBeNull();
      expect(response.username).toBe(data.username);
      expect(response.email).toBe(data.email);
    });

    it('should create a new user with all information', async () => {
      const data: CreateUserDto = {
        username: mockUserDto.username,
        email: mockUserDto.email,
        profilePicture: mockUserDto.profilePicture,
      };
      const response: User = await userService.create(data);
      expect(response.id).toBeDefined();
      expect(response.createdAt).toBeDefined();
      expect(response.currentStatus).toBe(0);
      expect(response.currentLadder).toBe(0);
      expect(response.profilePicture).toBe(data.profilePicture);
      expect(response.username).toBe(data.username);
      expect(response.email).toBe(data.email);
    });

    it('should throw a "UserAlreadyExistsException" if user already exists', async () => {
      const data: CreateUserDto = {
        username: mockUserDto.username,
        email: mockUserDto.email,
      };
      await userService.create(data);
      await expect(userService.create(data)).rejects.toThrow(
        UserAlreadyExistsException,
      );
    });
  });

  // Get all users
  describe('get all users', () => {
    beforeEach(async () => {
      await prisma.cleanDatabase();
    });

    it('should get an array with all users', async () => {
      // create few users
      await userService.create({ username: 'homer', email: 'homer@mail.com' });
      await userService.create({ username: 'marge', email: 'marge@mail.com' });
      await userService.create({ username: 'lisa', email: 'lisa@mail.com' });
      await userService.create({ username: 'bart', email: 'bart@mail.com' });
      const response: User[] = await userService.findAll({
        limit: null,
        offset: null,
      });
      expect(response.length).toBe(4);
    });

    it('should get an array with a certain number of user when a limit is set', async () => {
      // create few users
      await userService.create({ username: 'homer', email: 'homer@mail.com' });
      await userService.create({ username: 'marge', email: 'marge@mail.com' });
      await userService.create({ username: 'lisa', email: 'lisa@mail.com' });
      await userService.create({ username: 'bart', email: 'bart@mail.com' });
      const response: User[] = await userService.findAll({
        limit: 2,
        offset: null,
      });
      expect(response.length).toBe(2);
    });

    it('should get an array with a certain number of user when a limit and an offset is set', async () => {
      // create few users
      await userService.create({ username: 'homer', email: 'homer@mail.com' });
      await userService.create({ username: 'marge', email: 'marge@mail.com' });
      await userService.create({ username: 'lisa', email: 'lisa@mail.com' });
      await userService.create({ username: 'bart', email: 'bart@mail.com' });
      const response: User[] = await userService.findAll({
        limit: 2,
        offset: 3,
      });
      expect(response.length).toBe(1);
    });

    it('should throw a "NoUsersInDatabaseException" if the database contains no user', async () => {
      await expect(
        userService.findAll({ limit: 2, offset: null }),
      ).rejects.toThrow(NoUsersInDatabaseException);
    });
  });

  // Get user by id
  describe('get user by id', () => {
    beforeEach(async () => {
      await prisma.cleanDatabase();
    });

    it('should get a user with the correct id', async () => {
      const createResponse = await userService.create({
        username: mockUserDto.username,
        email: mockUserDto.email,
      });
      const response: User = await userService.findOne(createResponse.id);
      expect(response.id).toBe(createResponse.id);
    });

    it('should throw a "UserNotFoundException" if the user is not found', async () => {
      const createResponse = await userService.create({
        username: mockUserDto.username,
        email: mockUserDto.email,
      });
      await expect(userService.findOne(createResponse.id + 1)).rejects.toThrow(
        UserNotFoundException,
      );
    });
  });

  // Update a user
  describe('Update a user', () => {
    beforeEach(async () => {
      await prisma.cleanDatabase();
    });

    it('should update the attributes of an existing user', async () => {
      const createResponse = await userService.create({
        username: mockUserDto.username,
        email: mockUserDto.email,
      });
      const updateData: UpdateUserDto = {
        username: mockUserDto.username,
        email: mockUserDto.email,
      };
      const response: User = await userService.update(
        createResponse.id,
        updateData,
      );
      expect(response.username).toBe(updateData.username);
      expect(response.email).toBe(updateData.email);
      expect(response.id).toBe(createResponse.id);
    });

    it('should throw a "UserNotFoundException" if the user is not found', async () => {
      const createResponse = await userService.create({
        username: mockUserDto.username,
        email: mockUserDto.email,
      });
      const updateData: UpdateUserDto = {
        username: mockUserDto.username,
        email: mockUserDto.email,
      };
      await expect(
        userService.update(createResponse.id + 1, updateData),
      ).rejects.toThrow(UserNotFoundException);
    });
  });

  // Remove a user
  describe('Remove a user', () => {
    beforeEach(async () => {
      await prisma.cleanDatabase();
    });

    it('should remove an existing user', async () => {
      const createResponse = await userService.create({
        username: mockUserDto.username,
        email: mockUserDto.email,
      });
      await userService.remove(createResponse.id);
      await expect(userService.findOne(createResponse.id)).rejects.toThrow(
        UserNotFoundException,
      );
    });

    it('should throw a "UserNotFoundException" if the user is not found', async () => {
      const createResponse = await userService.create({
        username: mockUserDto.username,
        email: mockUserDto.email,
      });
      await expect(userService.remove(createResponse.id + 1)).rejects.toThrow(
        UserNotFoundException,
      );
    });
  });

  // Add a friend
  describe('Request a friendship', () => {
    beforeEach(async () => {
      await prisma.cleanDatabase();
    });

    it('should create a new friendship with status "requested"', async () => {
      // create 2 users
      const { id: id1 } = await userService.create({
        username: 'homer',
        email: 'homer@mail.com',
      });
      const { id: id2 } = await userService.create({
        username: 'marge',
        email: 'marge@mail.com',
      });
      // friendship them
      const createFriendshipDto: CreateFriendshipDto = { addresseeId: id2 };
      const createResponse: Friendship = await userService.createFriendship(
        id1,
        createFriendshipDto,
      );
      expect(createResponse.requesterId).toBe(id1);
      expect(createResponse.addresseeId).toBe(id2);
      expect(createResponse.status).toBe(
        userService.friendshipStatus.REQUESTED,
      );
    });

    it('should accept a friendship if the requester is the addressee of a requested friendship with the same other person', async () => {
      // create 2 users
      const { id: id1 } = await userService.create({
        username: 'homer',
        email: 'homer@mail.com',
      });
      const { id: id2 } = await userService.create({
        username: 'marge',
        email: 'marge@mail.com',
      });
      // friendship them
      const createFriendshipDto: CreateFriendshipDto = { addresseeId: id2 };
      const createResponse: Friendship = await userService.createFriendship(
        id1,
        createFriendshipDto,
      );
      // previous addressee is now requester
      const createFriendshipDto2: CreateFriendshipDto = { addresseeId: id1 };
      const createResponse2: Friendship = await userService.createFriendship(
        id2,
        createFriendshipDto2,
      );
      expect(createResponse2.requesterId).toBe(id1);
      expect(createResponse2.addresseeId).toBe(id2);
      expect(createResponse2.status).toBe(
        userService.friendshipStatus.ACCEPTED,
      );
      expect(createResponse2.date).not.toBe(createResponse.date);
    });

    it('should throw "FriendshipRequestedException" if the friendship has already been requested', async () => {
      // create 2 users
      const { id: id1 } = await userService.create({
        username: 'homer',
        email: 'homer@mail.com',
      });
      const { id: id2 } = await userService.create({
        username: 'marge',
        email: 'marge@mail.com',
      });
      // friendship them
      const createFriendshipDto: CreateFriendshipDto = { addresseeId: id2 };
      await userService.createFriendship(id1, createFriendshipDto);
      // same request
      const createFriendshipDto2: CreateFriendshipDto = { addresseeId: id2 };
      await expect(
        userService.createFriendship(id1, createFriendshipDto2),
      ).rejects.toThrow(FriendshipRequestedException);
    });

    it('should throw "FriendshipRejectedException" if the friendship has already been rejected', async () => {
      // create 2 users
      const { id: id1 } = await userService.create({
        username: 'homer',
        email: 'homer@mail.com',
      });
      const { id: id2 } = await userService.create({
        username: 'marge',
        email: 'marge@mail.com',
      });
      // 1 asks 2 to be friends
      const createFriendshipDto: CreateFriendshipDto = { addresseeId: id2 };
      await userService.createFriendship(id1, createFriendshipDto);
      // 2 rejects
      const updateFriendshipDto: UpdateFriendshipDto = {
        requesterId: id1,
        addresseeId: id2,
        status: 2, // rejected
      };
      await friendshipService.update(updateFriendshipDto);
      // same request from 1
      const createFriendshipDto2: CreateFriendshipDto = { addresseeId: id2 };
      await expect(
        userService.createFriendship(id1, createFriendshipDto2),
      ).rejects.toThrow(FriendshipRejectedException);
    });

    it('should throw "FriendshipAlreadyExistsException" if the friendship has already been accepted', async () => {
      // create 2 users
      const { id: id1 } = await userService.create({
        username: 'homer',
        email: 'homer@mail.com',
      });
      const { id: id2 } = await userService.create({
        username: 'marge',
        email: 'marge@mail.com',
      });
      // friendship them
      const createFriendshipDto: CreateFriendshipDto = { addresseeId: id2 };
      await userService.createFriendship(id1, createFriendshipDto);
      const createFriendshipDto2: CreateFriendshipDto = { addresseeId: id1 };
      await userService.createFriendship(id2, createFriendshipDto2);
      // same request
      const createFriendshipDto3: CreateFriendshipDto = { addresseeId: id2 };
      await expect(
        userService.createFriendship(id1, createFriendshipDto3),
      ).rejects.toThrow(FriendshipAlreadyExistsException);
    });
  });
});
