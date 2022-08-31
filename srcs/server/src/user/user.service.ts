import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Credentials, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
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

  async create(createUserDto: CreateUserDto): Promise<User> {
    const maybeUser = await this.prisma.user.findUnique({
      where: { username: createUserDto.username },
    });
    if (maybeUser != null)
      throw new UserAlreadyExistsException(createUserDto.username);
    const userStat = { wins: 0, losses: 0 };
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        stats: {
          create: userStat,
        },
      },
    });
    return user;
  }

  async findAll(paginationQuery: PaginationQueryDto): Promise<User[]> {
    const { limit, offset } = paginationQuery;
    const query = {
      ...(limit && { take: +limit }),
      ...(offset && { skip: +offset }),
    };
    const result: User[] = await this.prisma.user.findMany(query);
    if (result.length == 0) throw new NoUsersInDatabaseException();
    return result;
  }

  async findOne(id: number): Promise<User> {
    const result: User | null = await this.prisma.user.findUnique({
      where: { id: id },
    });
    if (result == null) throw new UserNotFoundException(id);
    return result;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const result: User = await this.prisma.user.update({
        where: { id: id },
        data: { ...updateUserDto },
      });
      return result;
    } catch (e) {
      throw new UserNotFoundException(id);
    }
  }

  async remove(id: number): Promise<User> {
    try {
      const result: User = await this.prisma.user.delete({
        where: { id: id },
      });
      return result;
    } catch (e) {
      throw new UserNotFoundException(id);
    }
  }

  async getUserCredentialsByEmail(email: string): Promise<Credentials> {
    const userCredentials = this.prisma.credentials.findUnique({
      where: {
        email: email,
      },
    });
    return userCredentials;
  }

  async getUserCredentialsByUsername(username: string): Promise<Credentials> {
    const user = this.prisma.credentials.findUnique({
      where: {
        username: username,
      },
    });
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user: User = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  }

  async createUserWithoutPassword(
    userInfo: FtRegisterUserDto,
  ): Promise<User & { credentials: Credentials }> {
    const user = await this.prisma.user.create({
      data: {
        email: userInfo.email,
        username: userInfo.username,
        profilePicture: userInfo.profileImageUrl,
        credentials: {
          create: {
            email: userInfo.email,
            username: userInfo.username,
          },
        },
      },
      include: {
        credentials: true,
      },
    });
    return user;
  }

  async createUserWithPassword(
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

  async setTwoFactorSecret(
    userId: number,
    secret: string,
  ): Promise<Credentials> {
    console.log(`Updating UserId ${userId} TwoFactorSecret ${secret}`);
    const updated = await this.prisma.credentials.update({
      where: {
        userId: userId,
      },
      data: {
        twoFactorSecret: secret,
      },
    });
    return updated;
  }

  async setTwoFactorAuthentification(
    userId: number,
    onOrOff: boolean,
  ): Promise<Credentials> {
    const updated = await this.prisma.credentials.update({
      where: {
        userId: userId,
      },
      data: {
        twoFactorActivated: onOrOff,
      },
    });
    return updated;
  }
}
