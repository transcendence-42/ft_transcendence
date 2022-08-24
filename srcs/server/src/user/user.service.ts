import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Credentials, User } from '@prisma/client';
import {
  FtRegisterUserDto,
  LocalRegisterUserDto,
} from '../auth/dto/registerUser.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ResponseUserDto } from './dto/response-user.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

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
    if (await this.doesUserExists(createUserDto)) {
      throw new ConflictException(
        `User "${createUserDto.username}" already exists`,
      );
    }
    const user = await this.prisma.user.create({
      data: {
        username: createUserDto.username,
        email: createUserDto.email,
      },
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
    if (result.length == 0)
      throw new HttpException(`No users`, HttpStatus.NO_CONTENT);
    return result;
  }

  async findOne(id: number) {
    const result: ResponseUserDto | null = await this.prisma.user.findUnique({
      where: { id: id },
    });
    if (result == null) throw new NotFoundException(`User #${id} not found`);
    return result;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const result: UpdateUserDto = await this.prisma.user.update({
        where: { id: id },
        data: { ...updateUserDto },
      });
      return result;
    } catch (e) {
      throw new NotFoundException(`User #${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      const result: ResponseUserDto = await this.prisma.user.delete({
        where: { id: id },
      });
      return result;
    } catch (e) {
      throw new NotFoundException(`User #${id} not found`);
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
