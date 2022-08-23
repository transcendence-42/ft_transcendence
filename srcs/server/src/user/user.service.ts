import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Credentials, User } from '@prisma/client';
import {
  FtRegisterUserDto,
  LocalRegisterUserDto,
} from 'src/auth/dto/registerUser.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async doesUserExists(createUserDto: CreateUserDto): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { username: createUserDto.username },
    });
    if (user != null) {
      return true;
    }
    return false;
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: {
        username: createUserDto.username,
        email: createUserDto.email,
      },
    });
    return user;
  }

  async findAll() {
    const result: User[] = await this.prisma.user.findMany();
    return result;
  }

  async findOne(id: number) {
    const result = await this.prisma.user.findUnique({
      where: { id: id },
      select: { id: true, username: true },
    });
    return result;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
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
