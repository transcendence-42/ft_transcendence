import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Credentials, Friendship, Match, Rating, User } from '@prisma/client';
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
  BadRequestException,
} from './exceptions/';
import { RequestFriendshipDto } from './dto/request-friendship.dto';
import { FriendshipService } from 'src/friendship/friendship.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly friendshipService: FriendshipService,
  ) {}

  // USER CRUD OPERATIONS ------------------------------------------------------
  readonly includedUserRelations: object = {
    stats: true,
    ratingHistory: true,
    channels: {
      include: { channel: true },
    },
    friendshipRequested: true,
    friendshipAddressed: true,
    matches: true,
    achievements: true,
  };

  readonly includedMatchRelations: object = {
    players: {
      include: {
        player: true,
      },
    },
  };

  /** Create a new user */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const maybeUser = await this.prisma.user.findUnique({
      where: { username: createUserDto.username },
    });
    if (maybeUser != null)
      throw new UserAlreadyExistsException(createUserDto.username);
    const userStat = { wins: 0, losses: 0 };
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        stats: {
          create: userStat,
        },
        ratingHistory: {
          create: { rating: 1000 },
        },
        blockedUsersIds: [] as number[],
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
      console.log(
        `Updating user ${id} with dto ${JSON.stringify(updateUserDto)}`,
      );
      const result: User = await this.prisma.user.update({
        where: { id: id },
        data: { ...updateUserDto },
      });
      console.log(`The new user is ${JSON.stringify(result)}`);
      return result;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') throw new BadRequestException();
        else {
          throw new UserNotFoundException(id);
        }
      }
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
    const userCredentials = this.prisma.credentials.findUnique({
      where: {
        email: email,
      },
    });
    return userCredentials;
  }

  /** Get user credentials by username */
  async getUserCredentialsByUsername(username: string): Promise<Credentials> {
    const user = this.prisma.credentials.findUnique({
      where: {
        username: username,
      },
    });
    return user;
  }

  /** Get user by email */
  async getUserByEmail(email: string): Promise<User> {
    const user: User = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  }

  async createUserWithoutPassword(
    userInfo: FtRegisterUserDto,
  ): Promise<User & { credentials: Credentials }> {
    const user = await this.prisma.user.create({
      data: {
        email: userInfo.email,
        username: userInfo.username,
        profilePicture: userInfo.profileImageUrl,
        credentials: {
          create: {
            email: userInfo.email,
            username: userInfo.username,
          },
        },
        stats: {
          create: { wins: 0, losses: 0 },
        },
        ratingHistory: {
          create: { rating: 1000 },
        },
      },
      include: {
        credentials: true,
      },
    });
    return user;
  }

  async createUserWithPassword(
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
        stats: {
          create: { wins: 0, losses: 0 },
        },
        ratingHistory: {
          create: { rating: 1000 },
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

  /** Request a new friendship */
  async requestFriendship(
    id: number,
    requestFriendshipDto: RequestFriendshipDto,
  ): Promise<Friendship> {
    // calling create friendship of friendshipService with the proper DTO
    const createFriendshipDto = { requesterId: id, ...requestFriendshipDto };
    const result: Friendship = await this.friendshipService.create(
      createFriendshipDto,
    );
    return result;
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
    // if (result.length == 0) throw new NoUsersInDatabaseException();
    return result;
  }

  /** Find all friendship request for a user */
  async findUserFriendshipRequests(
    id: number,
    paginationQuery: PaginationQueryDto,
  ): Promise<Friendship[]> {
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
    const result: Friendship[] = await this.prisma.friendship.findMany({
      ...pagination,
      include: this.includedFriendshipRelations,
      where: {
        AND: [{ addresseeId: id }, { status: this.friendshipStatus.REQUESTED }],
      },
    });
    if (result.length == 0) throw new NoUsersInDatabaseException();
    return result;
  }

  // RANK OPERATIONS -----------------------------------------------------------
  /** Find all user ranks through history */
  async findUserRatings(
    id: number,
    paginationQuery: PaginationQueryDto,
  ): Promise<Rating[]> {
    // check if user exists
    const isUser: User | null = await this.prisma.user.findUnique({
      where: { id: id },
    });
    if (isUser == null) throw new UserNotFoundException(id);
    // query ratings
    const { limit, offset } = paginationQuery;
    const pagination = {
      ...(limit && { take: +limit }),
      ...(offset && { skip: +offset }),
    };
    const result: Rating[] = await this.prisma.rating.findMany({
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

  // MATCH OPERATIONS ----------------------------------------------------------
  /** Find all user matches through history */
  async findUserMatches(
    id: number,
    paginationQuery: PaginationQueryDto,
  ): Promise<Match[]> {
    // check if user exists
    const isUser: User | null = await this.prisma.user.findUnique({
      where: { id: id },
    });
    if (isUser == null) throw new UserNotFoundException(id);
    // query matches
    const { limit, offset } = paginationQuery;
    const pagination = {
      ...(limit && { take: +limit }),
      ...(offset && { skip: +offset }),
    };
    const result: Match[] = await this.prisma.match.findMany({
      ...pagination,
      where: { players: { some: { playerId: id } } },
      orderBy: {
        date: 'desc',
      },
      include: this.includedMatchRelations,
    });
    return result;
  }

  async setTwoFactorSecret(
    userId: number,
    secret: string,
  ): Promise<Credentials> {
    console.log(`Updating UserId ${userId} TwoFactorSecret ${secret}`);
    const updated = await this.prisma.credentials.update({
      where: {
        userId: userId,
      },
      data: {
        twoFactorSecret: secret,
      },
    });
    return updated;
  }

  async setTwoFactorAuthentification(
    userId: number,
    onOrOff: boolean,
  ): Promise<Credentials> {
    const updated = await this.prisma.credentials.update({
      where: {
        userId: userId,
      },
      data: {
        twoFactorActivated: onOrOff,
      },
    });
    return updated;
  }
}
