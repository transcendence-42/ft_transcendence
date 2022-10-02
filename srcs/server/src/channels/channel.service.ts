import { Injectable } from '@nestjs/common';
import { ChannelType, UserOnChannel, UserRole } from '@prisma/client';
import { Logger } from 'nestjs-pino';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import {
  CreateUserOnChannelDto,
  UpdateChannelDto,
  CreateChannelDto,
  UpdateUserOnChannelDto,
} from './dto';
import { Channel } from './entities';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ChannelAlreadyExistsException,
  ChannelNotFoundException,
  NoChannelsInDatabaseException,
} from './exceptions';
import { UserNotFoundException } from 'src/user/exceptions';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ChannelService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly logger: Logger,
  ) {}

  async findOne(id: number): Promise<Channel> {
    const channel = await this.prisma.channel.findUnique({
      where: {
        id,
      },
      include: {
        users: true,
      },
    });
    if (!channel) throw new ChannelNotFoundException(id);
    return channel;
  }

  async findAll(paginationQuerry: PaginationQueryDto): Promise<Channel[]> {
    const result: Channel[] = await this.prisma.channel.findMany({
      skip: paginationQuerry.offset,
      take: paginationQuerry.limit,
      include: {
        users: true,
      },
    });
    if (result.length === 0) throw new NoChannelsInDatabaseException();
    return result;
  }

  async create(createChannelDto: CreateChannelDto): Promise<Channel> {
    try {
      if (
        createChannelDto.type === ChannelType.PROTECTED ||
        createChannelDto.type === ChannelType.PUBLIC
      ) {
        const nameTaken = await this.prisma.channel.findFirst({
          where: { name: createChannelDto.name },
        });
        if (nameTaken)
          throw new ChannelAlreadyExistsException(createChannelDto.name);
      }
      const channel = await this.prisma.channel.create({
        data: {
          ...createChannelDto,
          users: {
            create: [
              { role: UserRole.OWNER, userId: createChannelDto.ownerId },
            ],
          },
        },
        include: {
          users: true,
        },
      });
      return channel;
    } catch (e) {
      this.logger.error(
        `Failed to create channel ${e['message']} with code ${e['code']}`,
      );
      throw new ChannelAlreadyExistsException(createChannelDto.name);
    }
  }

  async update(
    id: number,
    updateChannelDto: UpdateChannelDto,
  ): Promise<Channel> {
    try {
      const result: Channel = await this.prisma.channel.update({
        where: { id },
        data: { ...updateChannelDto },
      });
      return result;
    } catch (e) {
      throw new ChannelNotFoundException(id);
    }
  }

  async delete(id: number): Promise<Channel> {
    try {
      const channel = await this.prisma.channel.delete({
        where: { id },
      });
      return channel;
    } catch (e) {
      throw new ChannelNotFoundException(id);
    }
  }

  async createUserOnChannel(
    createUserOnChannelDto: CreateUserOnChannelDto,
  ): Promise<UserOnChannel> {
    try {
      const result = await this.prisma.userOnChannel.create({
        data: {
          ...createUserOnChannelDto,
        },
        include: { channel: true },
      });
      return result;
    } catch (e) {
      this.logger.error(
        `Prisma failed to create UserOnChannel ${JSON.stringify(
          createUserOnChannelDto,
          null,
          4,
        )} with error: ${JSON.stringify(e, null, 4)} ${e['message']}`,
      );
      throw new ChannelNotFoundException(createUserOnChannelDto.userId);
    }
  }

  async findUserOnChannel(
    channelId: number,
    userId: number,
  ): Promise<UserOnChannel> {
    const userOnChannel = await this.prisma.userOnChannel.findUnique({
      where: { channelId_userId: { userId, channelId } },
      include: { channel: true },
    });
    if (!userOnChannel) throw new UserNotFoundException(userId);
    return userOnChannel;
  }

  async updateUserOnChannel(
    channelId: number,
    userId: number,
    updateUserOnChannelDto: UpdateUserOnChannelDto,
  ): Promise<UserOnChannel> {
    try {
      const result = await this.prisma.userOnChannel.update({
        where: { channelId_userId: { channelId, userId } },
        data: { ...updateUserOnChannelDto },
        include: { channel: true },
      });
      return result;
    } catch (e) {
      this.logger.error(
        `Prisma failed to update UserOnChannel ${e['message']}`,
      );
      throw new UserNotFoundException(userId);
    }
  }

  async deleteUserOnChannel(
    channelId: number,
    userId: number,
  ): Promise<UserOnChannel> {
    try {
      const userOnChannel = await this.prisma.userOnChannel.delete({
        where: { channelId_userId: { channelId, userId } },
        include: { channel: true },
      });
      return userOnChannel;
    } catch (e) {
      throw new UserNotFoundException(userId);
    }
  }
}
