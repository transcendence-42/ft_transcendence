import { Injectable } from '@nestjs/common';
import { Friendship } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeleteFriendshipDto } from './dto/delete-friendship.dto';
import { FriendshipNotFoundException } from './exceptions/friendship-exceptions';

@Injectable()
export class FriendshipService {
  constructor(private readonly prisma: PrismaService) {}

  async remove(deleteUserDto: DeleteFriendshipDto) {
    try {
      const result: Friendship = await this.prisma.friendship.delete({
        where: {
          requesterId_addresseeId: {
            requesterId: deleteUserDto.requesterId,
            addresseeId: deleteUserDto.addresseeId,
          },
        },
      });
      return result;
    } catch (e) {
      throw new FriendshipNotFoundException(deleteUserDto);
    }
  }
}
