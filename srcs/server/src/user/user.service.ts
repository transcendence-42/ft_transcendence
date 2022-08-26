import { Injectable } from '@nestjs/common';
import { Credentials, User } from '@prisma/client';
import {
  FtRegisterUserDto,
  LocalRegisterUserDto,
} from 'src/auth/dto/registerUser.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async getUserCredentialsByEmail(email: string): Promise<Credentials | null> {
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

  /* don't need this anymore. Use getOne and insert email instead of id */
  async getUserByEmail(email: string): Promise<User> {
    const user: User | null = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  }

  /* don't need this anymore. Use createOne and insert email instead of id */
  async createUserWithoutCredentials(
    userInfo: FtRegisterUserDto,
  ): Promise<User> {
    const user: User = await this.prisma.user.create({
      data: {
        email: userInfo.email,
        username: userInfo.username,
        profile_picture: userInfo.profile_image_url,
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
            two_fa_activated: false,
          },
        },
      },
    });
    return user;
  }

  async setTwofaSecret(userId: number, secret: string) {
    console.debug(`this is user id ${userId}`);
    const updated = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        two_fa_secret: secret,
      },
    });
    return updated;
  }

  async updateTwoAuth(userId: number, onOrOff: boolean) {
    const updated = await this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        two_fa_activated: onOrOff,
      }
    });
  }
}
