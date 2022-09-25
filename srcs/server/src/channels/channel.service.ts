import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Channel } from 'src/generated/nestjs-dto/channel.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateChannelDto } from './dto/updateChannel.dto';
import { ChannelNotFoundException, NoChannelsInDatabaseException } from './exceptions';

@Injectable()
export class ChannelService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: number) {
    try {
    const channel: Channel = await this.prisma.channel.findUnique({
      where: {
        id,
      },
      include: {
        users: true,
      }
    });
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
      }
    });
    if (result.length === 0) throw new NoChannelsInDatabaseException();
    return result;
  }

  async update(id: number, updateChannelDto: UpdateChannelDto) {
    try {
      const result: Channel = await this.prisma.channel.update({
        where: {id},
        data: {...updateChannelDto},
      });
    } catch (e) {
      throw new ChannelNotFoundException(id);
    }
  }

  //to do: add userOnChannel endpoint
  //add delete
  //createChannel
  delete(channelId: number) {}
  updateUserOnChannel(id: number, updateUserOnChannelDto) {

  }
}
