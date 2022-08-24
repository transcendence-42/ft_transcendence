import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Credentials, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ResponseUserDto } from './dto/response-user.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import {
  FtRegisterUserDto,
  LocalRegisterUserDto,
} from '../auth/dto/registerUser.dto';
import {
  NoUsersInDatabaseException,
  UserAlreadyExistsException,
  UserNotFoundException,
} from './exceptions/user-exceptions';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const maybeUser = await this.prisma.user.findUnique({
      where: { username: createUserDto.username },
    });
    if (maybeUser != null)
      throw new UserAlreadyExistsException(createUserDto.username);

    const user = await this.prisma.user.create({
      data: { ...createUserDto },
    });
    return user;
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    const query = {
      ...(limit && { take: +limit }),
      ...(offset && { skip: +offset }),
    };
    const result: User[] = await this.prisma.user.findMany(query);
    if (result.length == 0) throw new NoUsersInDatabaseException();
    return result;
  }

  async findOne(id: number) {
    const result: User | null = await this.prisma.user.findUnique({
      where: { id: id },
    });
    if (result == null) throw new UserNotFoundException(id);
    return result;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const result: ResponseUserDto = await this.prisma.user.update({
        where: { id: id },
        data: { ...updateUserDto },
      });
      return result;
    } catch (e) {
      throw new UserNotFoundException(id);
    }
  }

  async remove(id: number) {
    try {
      const result: ResponseUserDto = await this.prisma.user.delete({
        where: { id: id },
      });
      return result;
    } catch (e) {
      throw new UserNotFoundException(id);
    }
  }

  async getUserCredentialsByEmail(email: string): Promise<Credentials> {
    try {
      const user = await this.prisma.credentials.findUnique({
        where: {
          email: email,
        },
      });
      return user;
    } catch (err) {
      return null;
    }
  }

  async getUserCredentialsByUsername(username: string): Promise<Credentials> {
    try {
      const user = await this.prisma.credentials.findUnique({
        where: {
          username: username,
        },
      });
      return user;
    } catch (err) {
      return null;
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    const user: User | null = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  }

  async createUserWithoutCredentials(
    userInfo: FtRegisterUserDto,
  ): Promise<User> {
    const user: User = await this.prisma.user.create({
      data: {
        email: userInfo.email,
        username: userInfo.username,
        profilePicture: userInfo.profile_image_url,
      },
    });
    return user;
  }

  async createUserWithCredentials(
    userInfo: LocalRegisterUserDto,
    hash: string,
  ): Promise<User> {
    const user: User = await this.prisma.user.create({
      data: {
        email: userInfo.email,
        username: userInfo.username,
        credentials: {
          create: {
            username: userInfo.username,
            email: userInfo.email,
            password: hash,
          },
        },
      },
    });
    return user;
  }
}
