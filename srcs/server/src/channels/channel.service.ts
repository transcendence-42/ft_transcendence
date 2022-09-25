import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Channel } from 'src/generated/nestjs-dto/channel.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateChannelDto } from './dto/updateChannel.dto';
import { NoChannelsInDatabaseException } from './exceptions';

@Injectable()
export class ChannelService {
  constructor(private readonly prisma: PrismaService) {}

  findOne(channelId: number) {}

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

  deleteOne(channelId: number) {}

  deleteMany() {}

  update(id: number, updateChannelDto: UpdateChannelDto) {}
}
