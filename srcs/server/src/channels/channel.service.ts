import { Injectable } from '@nestjs/common';
import { UserOnChannel } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Logger } from 'nestjs-pino';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Channel } from 'src/generated/nestjs-dto/channel.entity';
import { CreateUserOnChannelDto } from 'src/generated/nestjs-dto/create-userOnChannel.dto';
import { UpdateUserOnChannelDto } from 'src/generated/nestjs-dto/update-userOnChannel.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateChannelDto } from './dto/updateChannel.dto';
import {
  ChannelNotFoundException,
  NoChannelsInDatabaseException,
} from './exceptions';

@Injectable()
export class ChannelService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: Logger,
  ) {}

  async findOne(id: number): Promise<Channel> {
    try {
      const channel: Channel = await this.prisma.channel.findUnique({
        where: {
          id,
        },
        include: {
          users: true,
        },
      });
      return channel;
    } catch (e) {
      throw new ChannelNotFoundException(id);
    }
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

  //add delete
  //createChannel
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
      throw new ChannelNotFoundException(channelId);
    }
  }

  delete(channelId: number) {}
}
