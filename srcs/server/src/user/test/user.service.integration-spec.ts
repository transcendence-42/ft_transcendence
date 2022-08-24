import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppModule } from 'src/app.module';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '@prisma/client';
import {
  NoUsersInDatabaseException,
  UserAlreadyExistsException,
  UserNotFoundException,
} from '../exceptions/user-exceptions';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ResponseUserDto } from '../dto/response-user.dto';

describe('User service integration tests', () => {
  let service: UserService;
  let prisma: PrismaService;

  // setup modules for test
  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = moduleRef.get<UserService>(UserService);
    prisma = moduleRef.get(PrismaService);
  });

  // Create user
  describe('create user', () => {
    beforeEach(async () => {
      await prisma.cleanDatabase();
    });

    it('should create a new user with only required information', async () => {
      const data: CreateUserDto = {
        username: 'homer',
        email: 'homer@springfield.com',
      };
      const response: User = await service.create(data);
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
        username: 'homer',
        email: 'homer@springfield.com',
        profilePicture: 'http://site.com/image.png',
        currentStatus: 1,
        currentLadder: 17,
      };
      const response: User = await service.create(data);
      expect(response.id).toBeDefined();
      expect(response.createdAt).toBeDefined();
      expect(response.currentStatus).toBe(data.currentStatus);
      expect(response.currentLadder).toBe(data.currentLadder);
      expect(response.profilePicture).toBe(data.profilePicture);
      expect(response.username).toBe(data.username);
      expect(response.email).toBe(data.email);
    });

    it('should throw a "UserAlreadyExistsException" if user already exists', async () => {
      const data: CreateUserDto = {
        username: 'homer',
        email: 'homer@springfield.com',
      };
      await service.create(data);
      await expect(service.create(data)).rejects.toThrow(
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
      await service.create({ username: 'homer', email: 'homer@mail.com' });
      await service.create({ username: 'marge', email: 'marge@mail.com' });
      await service.create({ username: 'lisa', email: 'lisa@mail.com' });
      await service.create({ username: 'bart', email: 'bart@mail.com' });
      const response: User[] = await service.findAll({
        limit: null,
        offset: null,
      });
      expect(response.length).toBe(4);
    });

    it('should get an array with a certain number of user when a limit is set', async () => {
      // create few users
      await service.create({ username: 'homer', email: 'homer@mail.com' });
      await service.create({ username: 'marge', email: 'marge@mail.com' });
      await service.create({ username: 'lisa', email: 'lisa@mail.com' });
      await service.create({ username: 'bart', email: 'bart@mail.com' });
      const response: User[] = await service.findAll({
        limit: 2,
        offset: null,
      });
      expect(response.length).toBe(2);
    });

    it('should get an array with a certain number of user when a limit and an offset is set', async () => {
      // create few users
      await service.create({ username: 'homer', email: 'homer@mail.com' });
      await service.create({ username: 'marge', email: 'marge@mail.com' });
      await service.create({ username: 'lisa', email: 'lisa@mail.com' });
      await service.create({ username: 'bart', email: 'bart@mail.com' });
      const response: User[] = await service.findAll({
        limit: 2,
        offset: 3,
      });
      expect(response.length).toBe(1);
    });

    it('should throw a "NoUsersInDatabaseException" if the database contains no user', async () => {
      await expect(service.findAll({ limit: 2, offset: null })).rejects.toThrow(
        NoUsersInDatabaseException,
      );
    });
  });

  // Get user by id
  describe('get user by id', () => {
    beforeEach(async () => {
      await prisma.cleanDatabase();
    });

    it('should get a user with the correct id', async () => {
      const createResponse = await service.create({
        username: 'homer',
        email: 'homer@mail.com',
      });
      const response: User = await service.findOne(createResponse.id);
      expect(response.id).toBe(createResponse.id);
    });

    it('should throw a "UserNotFoundException" if the user is not found', async () => {
      const createResponse = await service.create({
        username: 'homer',
        email: 'homer@mail.com',
      });
      await expect(service.findOne(createResponse.id + 1)).rejects.toThrow(
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
      const createResponse = await service.create({
        username: 'homer',
        email: 'homer@mail.com',
      });
      const updateData: UpdateUserDto = {
        username: 'new_homer',
        email: 'homer_updated@mail.com',
        currentStatus: 5,
        currentLadder: 2,
      };
      const response: ResponseUserDto = await service.update(
        createResponse.id,
        updateData,
      );
      expect(response.username).toBe(updateData.username);
      expect(response.email).toBe(updateData.email);
      expect(response.currentLadder).toBe(updateData.currentLadder);
      expect(response.currentStatus).toBe(updateData.currentStatus);
      expect(response.id).toBe(createResponse.id);
    });

    it('should throw a "UserNotFoundException" if the user is not found', async () => {
      const createResponse = await service.create({
        username: 'homer',
        email: 'homer@mail.com',
      });
      const updateData: UpdateUserDto = {
        username: 'new_homer',
        email: 'homer_updated@mail.com',
        currentStatus: 5,
        currentLadder: 2,
      };
      await expect(
        service.update(createResponse.id + 1, updateData),
      ).rejects.toThrow(UserNotFoundException);
    });
  });

  // Remove a user
  describe('Remove a user', () => {
    beforeEach(async () => {
      await prisma.cleanDatabase();
    });

    it('should remove an existing user', async () => {
      const createResponse = await service.create({
        username: 'homer',
        email: 'homer@mail.com',
      });
      await service.remove(createResponse.id);
      await expect(service.findOne(createResponse.id)).rejects.toThrow(
        UserNotFoundException,
      );
    });

    it('should throw a "UserNotFoundException" if the user is not found', async () => {
      const createResponse = await service.create({
        username: 'homer',
        email: 'homer@mail.com',
      });
      await expect(service.remove(createResponse.id + 1)).rejects.toThrow(
        UserNotFoundException,
      );
    });
  });
});
