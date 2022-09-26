import { Injectable } from '@nestjs/common';
import { Friendship, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserNotFoundException } from 'src/user/exceptions';
import { CreateFriendshipDto } from './dto/create-friendship.dto';
import { DeleteFriendshipDto } from './dto/delete-friendship.dto';
import { FindFriendshipDto } from './dto/find-friendship.dto';
import { UpdateFriendshipDto } from './dto/update-friendship.dto';
import {
  FriendshipAlreadyExistsException,
  FriendshipNotFoundException,
  FriendshipRejectedException,
  FriendshipRequestedException,
} from './exceptions/';

@Injectable()
export class FriendshipService {
  constructor(private readonly prisma: PrismaService) {}

  readonly friendshipStatus = Object.freeze({
    REQUESTED: 0,
    ACCEPTED: 1,
    REJECTED: 2,
  });

  // FRIENDSHIP CRUD OPERATIONS ------------------------------------------------
  /** Remove a friendship */
  async remove(deleteUserDto: DeleteFriendshipDto): Promise<Friendship> {
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

  /** Update a friendship */
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

  /** Find a friendship by id (requester / addressee) */
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

  /** Handle the case where we try to update an existing friendship */
  private async _handleExistingFriendship(
    friendship: Friendship,
    friendshipRequest: CreateFriendshipDto,
  ): Promise<Friendship> {
    switch (friendship.status) {
      // Already friends
      case this.friendshipStatus.ACCEPTED:
        throw new FriendshipAlreadyExistsException(
          friendshipRequest.requesterId,
          friendshipRequest.addresseeId,
        );
      // Friendship already rejected or requested
      case this.friendshipStatus.REQUESTED:
      case this.friendshipStatus.REJECTED:
        if (friendship.requesterId === friendshipRequest.requesterId) {
          // same requester : no change
          if (friendship.status === this.friendshipStatus.REJECTED)
            throw new FriendshipRejectedException(
              friendshipRequest.requesterId,
              friendshipRequest.addresseeId,
            );
          if (friendship.status === this.friendshipStatus.REQUESTED)
            throw new FriendshipRequestedException(
              friendshipRequest.requesterId,
              friendshipRequest.addresseeId,
            );
        } else {
          // reverse : accept
          const result: Friendship = await this.prisma.friendship.update({
            where: {
              requesterId_addresseeId: {
                addresseeId: friendship.addresseeId,
                requesterId: friendship.requesterId,
              },
            },
            data: { status: this.friendshipStatus.ACCEPTED, date: new Date() },
          });
          return result;
        }
    }
  }

  /** Create a new friendship */
  async create(createFriendshipDto: CreateFriendshipDto): Promise<Friendship> {
    // check if requester and addressee exists
    const areUsers: User[] = await this.prisma.user.findMany({
      where: {
        OR: [
          { id: createFriendshipDto.requesterId },
          { id: createFriendshipDto.addresseeId },
        ],
      },
    });
    if (areUsers.length != 2)
      throw new UserNotFoundException(
        areUsers.filter((user) => user.id === createFriendshipDto.requesterId)
          .length > 0
          ? createFriendshipDto.addresseeId
          : createFriendshipDto.requesterId,
      );
    // check if friendship already exists
    const maybeFriendship = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          {
            requesterId: createFriendshipDto.requesterId,
            addresseeId: createFriendshipDto.addresseeId,
          },
          {
            requesterId: createFriendshipDto.addresseeId,
            addresseeId: createFriendshipDto.requesterId,
          },
        ],
      },
    });
    if (maybeFriendship != null) {
      // friendship exists, update it or throw
      const result = await this._handleExistingFriendship(
        maybeFriendship,
        createFriendshipDto,
      );
      return result;
    } else {
      // friendship don't exists, create it with status requested
      const result = await this.prisma.friendship.create({
        data: createFriendshipDto,
      });
      return result;
    }
  }
}
