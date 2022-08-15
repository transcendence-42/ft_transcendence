import { Injectable } from '@nestjs/common';
import { Credentials, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserCredentialsByEmail(email: string): Promise<Credentials | null> {
    const user = await this.prisma.credentials.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user: User | null = await this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    return user;
  }

  async createUser(userInfo: User, hash: string): Promise<User> {
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
