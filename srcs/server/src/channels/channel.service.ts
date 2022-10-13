import { Injectable, Logger } from '@nestjs/common';
import { ChannelType, UserOnChannel, UserRole } from '@prisma/client';
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
} from './exceptions';
import { UserNotFoundException } from 'src/user/exceptions';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ChannelService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  private readonly logger = new Logger(ChannelService.name);
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
    if (result.length === 0) [];
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
        include: { users: true },
      });
      return result;
    } catch (e) {
      this.logger.error('In update channel');
      throw new ChannelNotFoundException(id);
    }
  }

  async delete(id: number): Promise<Channel> {
    this.logger.debug(`Deleting from channel service`);
    try {
      const channel = await this.prisma.channel.delete({
        where: { id },
      });
      return channel;
    } catch (e) {
      this.logger.error('In delete channel');
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
    if (!userOnChannel) {
      this.logger.debug(`Not found our user ${userId} in channel ${channelId}`);
      throw new UserNotFoundException(userId);
    }
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
    this.logger.debug(
      `Trying to delete user here with id ${userId} and channel ${channelId}`,
    );
    try {
      const channel = await this.prisma.channel.findUnique({
        where: { id: channelId },
        include: { users: true },
      });
      if (channel.ownerId === userId) {
        if (this._countUsersStillInChannel(channel.users) === 1) {
          this.logger.debug(
            `Deleting channel ${channelId} in delete UserONChannel`,
          );
          await this.delete(channelId);
          return channel.users[0];
        } else {
          const newOwnerId = this._findNextOwner(channel.users, userId);
          this.logger.debug(
            `finding next owner for channel ${channelId} in delete UserONChannel`,
          );
          await this.update(channelId, {
            ownerId: newOwnerId,
          } as UpdateChannelDto);
          await this.updateUserOnChannel(channel.id, newOwnerId, {
            role: UserRole.OWNER,
          } as UpdateUserOnChannelDto);
        }
      }
      const userOnChannel = await this.prisma.userOnChannel.delete({
        where: { channelId_userId: { channelId, userId } },
        include: { channel: true },
      });
      return userOnChannel;
    } catch (e) {
      this.logger.debug(
        `Got error ${JSON.stringify(e, null, 4)} when trying to delete user`,
      );
      throw new UserNotFoundException(userId);
    }
  }

  private _countUsersStillInChannel(users: UserOnChannel[]): number {
    let numberOfUsers = 0;
    for (const user of users) {
      if (user.hasLeftChannel === false) numberOfUsers += 1;
    }
    return numberOfUsers;
  }

  private _findNextOwner(
    users: UserOnChannel[],
    currentOwnerId: number,
  ): number {
    users.sort((a: { joinedAt: Date }, b: { joinedAt: Date }) =>
      a.joinedAt < b.joinedAt ? 1 : -1,
    );
    let newOwner = users.find(
      (user: UserOnChannel) =>
        user.hasLeftChannel === false && user.userId !== currentOwnerId,
    );
    if (newOwner) {
      this.logger.debug(
        ` 1 returning user ${newOwner.userId} to be the new owner`,
      );
      return newOwner.userId;
    }
    this.logger.debug(
      ` 2 returning user ${users[1].userId} to be the new owner`,
    );
    return users[1].userId; //return the oldest user
  }
}
