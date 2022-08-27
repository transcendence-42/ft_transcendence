import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Credentials, Friendship, Rank, Stats, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import {
  FtRegisterUserDto,
  LocalRegisterUserDto,
} from '../auth/dto/registerUser.dto';
import {
  NoUsersInDatabaseException,
  UserAlreadyExistsException,
  UserNotFoundException,
} from './exceptions/user-exceptions';
import { CreateFriendshipDto } from './dto/create-friendship.dto';
import {
  FriendshipAlreadyExistsException,
  FriendshipRejectedException,
  FriendshipRequestedException,
} from 'src/friendship/exceptions/friendship-exceptions';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  readonly friendshipStatus = Object.freeze({
    REQUESTED: 0,
    ACCEPTED: 1,
    REJECTED: 2,
  });

  private async _calculateRank(wins: number, losses: number): Promise<number> {
    return wins + losses + 1; // fake return before real function
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const maybeUser = await this.prisma.user.findUnique({
      where: { username: createUserDto.username },
    });
    if (maybeUser != null)
      throw new UserAlreadyExistsException(createUserDto.username);
    const userStat = { wins: 0, losses: 0 };
    const rank = await this._calculateRank(0, 0);
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        stats: {
          create: userStat,
        },
        rankingHistory: {
          create: {
            position: rank,
          },
        },
      },
    });
    return user;
  }

  async findAll(paginationQuery: PaginationQueryDto): Promise<User[]> {
    const { limit, offset } = paginationQuery;
    const query = {
      ...(limit && { take: +limit }),
      ...(offset && { skip: +offset }),
    };
    const result: User[] = await this.prisma.user.findMany(query);
    if (result.length == 0) throw new NoUsersInDatabaseException();
    return result;
  }

  async findOne(id: number): Promise<User> {
    const result: User | null = await this.prisma.user.findUnique({
      where: { id: id },
    });
    if (result == null) throw new UserNotFoundException(id);
    return result;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const result: User = await this.prisma.user.update({
        where: { id: id },
        data: { ...updateUserDto },
      });
      return result;
    } catch (e) {
      throw new UserNotFoundException(id);
    }
  }

  async remove(id: number): Promise<User> {
    try {
      const result: User = await this.prisma.user.delete({
        where: { id: id },
      });
      return result;
    } catch (e) {
      throw new UserNotFoundException(id);
    }
  }

  async getUserCredentialsByEmail(email: string): Promise<Credentials> {
    try {
      const user = await this.prisma.credentials.findUnique({
        where: {
          email: email,
        },
      });
      return user;
    } catch (err) {
      return null;
    }
  }

  async getUserCredentialsByUsername(username: string): Promise<Credentials> {
    try {
      const user = await this.prisma.credentials.findUnique({
        where: {
          username: username,
        },
      });
      return user;
    } catch (err) {
      return null;
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    const user: User | null = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  }

  async createUserWithoutCredentials(
    userInfo: FtRegisterUserDto,
  ): Promise<User> {
    const user: User = await this.prisma.user.create({
      data: {
        email: userInfo.email,
        username: userInfo.username,
        profilePicture: userInfo.profile_image_url,
      },
    });
    return user;
  }

  async createUserWithCredentials(
    userInfo: LocalRegisterUserDto,
    hash: string,
  ): Promise<User> {
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

  private async _handleExistingFriendship(
    requesterId: number,
    friendship: Friendship,
    friendshipRequest: CreateFriendshipDto,
  ): Promise<Friendship> {
    switch (friendship.status) {
      // Already friends
      case this.friendshipStatus.ACCEPTED:
        throw new FriendshipAlreadyExistsException(
          requesterId,
          friendshipRequest.addresseeId,
        );
      // Friendship already rejected or requested
      case this.friendshipStatus.REQUESTED:
      case this.friendshipStatus.REJECTED:
        if (friendship.requesterId === requesterId) {
          // same requester : no change
          if (friendship.status === this.friendshipStatus.REJECTED)
            throw new FriendshipRejectedException(
              requesterId,
              friendshipRequest.addresseeId,
            );
          if (friendship.status === this.friendshipStatus.REQUESTED)
            throw new FriendshipRequestedException(
              requesterId,
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

  async createFriendship(
    id: number,
    createFriendshipDto: CreateFriendshipDto,
  ): Promise<Friendship> {
    // check if requester and addressee exists
    const areUsers: User[] | null = await this.prisma.user.findMany({
      where: {
        OR: [{ id: id }, { id: createFriendshipDto.addresseeId }],
      },
    });
    if (areUsers.length != 2)
      throw new UserNotFoundException(
        areUsers.filter((user) => user.id === id).length > 0
          ? createFriendshipDto.addresseeId
          : id,
      );
    // check if friendship already exists
    const maybeFriendship = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          {
            requesterId: id,
            addresseeId: createFriendshipDto.addresseeId,
          },
          {
            requesterId: createFriendshipDto.addresseeId,
            addresseeId: id,
          },
        ],
      },
    });
    if (maybeFriendship != null) {
      // friendship exists, update it or throw
      const result = await this._handleExistingFriendship(
        id,
        maybeFriendship,
        createFriendshipDto,
      );
      return result;
    } else {
      // friendship don't exists, create it with status requested
      const result = await this.prisma.friendship.create({
        data: {
          requesterId: id,
          ...createFriendshipDto,
        },
      });
      return result;
    }
  }

  async findUserFriends(
    id: number,
    paginationQuery: PaginationQueryDto,
  ): Promise<User[]> {
    // check if user exists
    const isUser: User | null = await this.prisma.user.findUnique({
      where: { id: id },
    });
    if (isUser == null) throw new UserNotFoundException(id);
    // query friends
    const { limit, offset } = paginationQuery;
    const pagination = {
      ...(limit && { take: +limit }),
      ...(offset && { skip: +offset }),
    };
    const result: User[] = await this.prisma.user.findMany({
      ...pagination,
      where: {
        OR: [
          {
            AND: [
              {
                friendshipAddressed: {
                  some: {
                    AND: [
                      { status: this.friendshipStatus.ACCEPTED },
                      {
                        OR: [{ requesterId: id }, { addresseeId: id }],
                      },
                    ],
                  },
                },
              },
              { NOT: { id: id } },
            ],
          },
          {
            AND: [
              {
                friendshipRequested: {
                  some: {
                    AND: [
                      { status: this.friendshipStatus.ACCEPTED },
                      {
                        OR: [{ requesterId: id }, { addresseeId: id }],
                      },
                    ],
                  },
                },
              },
              { NOT: { id: id } },
            ],
          },
        ],
      },
    });
    if (result.length == 0) throw new NoUsersInDatabaseException();
    return result;
  }

  async findUserRanks(
    id: number,
    paginationQuery: PaginationQueryDto,
  ): Promise<Rank[]> {
    // check if user exists
    const isUser: User | null = await this.prisma.user.findUnique({
      where: { id: id },
    });
    if (isUser == null) throw new UserNotFoundException(id);
    // query ranks
    const { limit, offset } = paginationQuery;
    const pagination = {
      ...(limit && { take: +limit }),
      ...(offset && { skip: +offset }),
    };
    const result: Rank[] = await this.prisma.rank.findMany({
      ...pagination,
      where: {
        userId: id,
      },
      orderBy: {
        date: 'desc',
      },
    });
    return result;
  }
}
