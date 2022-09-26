import { Injectable } from '@nestjs/common';
import { UserOnChannel } from '@prisma/client';
import { Logger } from 'nestjs-pino';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Channel } from 'src/generated/nestjs-dto/channel.entity';
import {
  CreateUserOnChannelDto,
  UpdateChannelDto,
  CreateChannelDto,
  UpdateUserOnChannelDto,
} from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ChannelAlreadyExistsException,
  ChannelNotFoundException,
  NoChannelsInDatabaseException,
} from './exceptions';
import { UserNotFoundException } from 'src/user/exceptions';

@Injectable()
export class ChannelService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: Logger,
  ) {}

  async findOne(id: number): Promise<Channel> {
    const channel: Channel = await this.prisma.channel.findUnique({
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
    if (!paginationQuerry.limit) {
      paginationQuerry.limit = 0;
    }
    if (!paginationQuerry.offset) {
      paginationQuerry.offset = 0;
    }
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
      const channel = await this.prisma.channel.create({
        data: { ...createChannelDto },
      });
      return channel;
    } catch (e) {
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
      });
      return result;
    } catch (e) {
      this.logger.error(
        `Prisma failed to create UserOnChannel ${e['message']}`,
      );
      throw new ChannelNotFoundException(createUserOnChannelDto.userId);
    }
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
      });
      return userOnChannel;
    } catch (e) {
      throw new UserNotFoundException(userId);
    }
  }
}
