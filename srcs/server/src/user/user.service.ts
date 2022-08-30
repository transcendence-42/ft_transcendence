import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Credentials, Friendship, Rank, User } from '@prisma/client';
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
} from 'src/friendship/exceptions/';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // USER CRUD OPERATIONS ------------------------------------------------------
  readonly includedUserRelations: object = {
    stats: true,
    rankingHistory: true,
    ownedChannels: true,
    channels: true,
    friendshipRequested: true,
    friendshipAddressed: true,
    matches: true,
    achievements: true,
  };

  readonly userStatus = Object.freeze({
    AWAY: 0,
    HERE: 1,
    PLAYING: 2,
  });

  /** Create a new user */
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

  /** Find all users */
  async findAll(paginationQuery: PaginationQueryDto): Promise<User[]> {
    const { limit, offset } = paginationQuery;
    const query: object = {
      ...(limit && { take: +limit }),
      ...(offset && { skip: +offset }),
      include: this.includedUserRelations,
    };
    const result: User[] = await this.prisma.user.findMany(query);
    if (result.length == 0) throw new NoUsersInDatabaseException();
    return result;
  }

  /** Find one user */
  async findOne(id: number): Promise<User> {
    const result: User | null = await this.prisma.user.findUnique({
      where: { id: id },
      include: this.includedUserRelations,
    });
    if (result == null) throw new UserNotFoundException(id);
    return result;
  }

  /** Update one user */
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

  /** Remove one user */
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

  // USER AUTH OPERATIONS ------------------------------------------------------
  /** Get user credentials by email */
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

  /** Get user credentials by username */
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

  /** Get user by email */
  async getUserByEmail(email: string): Promise<User> {
    const user: User | null = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  }

  /** Create user */
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

  /** Create user without credentials */
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

  // FRIENDSHIP OPERATIONS -----------------------------------------------------
  readonly includedFriendshipRelations: object = {
    requester: true,
    addressee: true,
  };

  readonly friendshipStatus = Object.freeze({
    REQUESTED: 0,
    ACCEPTED: 1,
    REJECTED: 2,
  });

  /** Handle the case where we try to update an existing friendship */
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

  /** Create a new friendship */
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

  /** Find all friends of a user */
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
      include: this.includedUserRelations,
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

  // RANK OPERATIONS -----------------------------------------------------------
  /** Calculate the rank of a user based on its stats and last match result */
  private async _calculateRank(wins: number, losses: number): Promise<number> {
    return wins + losses + 1; // fake return before real function
  }

  /** Find all user ranks through history */
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
