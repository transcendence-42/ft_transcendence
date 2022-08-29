import { Injectable } from '@nestjs/common';
import { Friendship } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeleteFriendshipDto } from './dto/delete-friendship.dto';
import { FindFriendshipDto } from './dto/find-friendship.dto';
import { UpdateFriendshipDto } from './dto/update-friendship.dto';
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
      throw new FriendshipNotFoundException(
        deleteUserDto.requesterId,
        deleteUserDto.addresseeId,
      );
    }
  }

  async update(updateFrienshipDto: UpdateFriendshipDto): Promise<Friendship> {
    try {
      const result: Friendship = await this.prisma.friendship.update({
        where: {
          requesterId_addresseeId: {
            requesterId: updateFrienshipDto.requesterId,
            addresseeId: updateFrienshipDto.addresseeId,
          },
        },
        data: { status: updateFrienshipDto.status, date: new Date() },
      });
      return result;
    } catch (e) {
      throw new FriendshipNotFoundException(
        updateFrienshipDto.requesterId,
        updateFrienshipDto.addresseeId,
      );
    }
  }

  async findOne(findFriendshipDto: FindFriendshipDto): Promise<Friendship> {
    const result: Friendship | null = await this.prisma.friendship.findUnique({
      where: {
        requesterId_addresseeId: {
          requesterId: findFriendshipDto.requesterId,
          addresseeId: findFriendshipDto.addresseeId,
        },
      },
    });
    if (result == null)
      throw new FriendshipNotFoundException(
        findFriendshipDto.requesterId,
        findFriendshipDto.addresseeId,
      );
    return result;
  }
}
