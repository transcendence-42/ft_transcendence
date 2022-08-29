import { Injectable } from '@nestjs/common';
import { Match } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/user/entities/user.entity';
import { UserNotFoundException } from 'src/user/exceptions/user-exceptions';
import { UserService } from 'src/user/user.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import {
  MatchAlreadyExistsException,
  MatchWithOnePlayerException,
  PlayersNotAvailableException,
} from './exceptions/match-exception';

@Injectable()
export class MatchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  // MATCH CRUD OPERATIONS -----------------------------------------------------
  readonly matchStatus = Object.freeze({
    CREATED: 0,
    STARTED: 1,
    FINISHED: 2,
  });

  /** check if a match exists in database */
  async _isMatchExists(createMatchDto: CreateMatchDto): Promise<boolean> {
    const maybeMatch = await this.prisma.match.findFirst({
      where: {
        AND: [
          {
            AND: [
              {
                players: {
                  some: { playerId: createMatchDto.idPlayer1 },
                },
              },
              {
                players: {
                  some: { playerId: createMatchDto.idPlayer2 },
                },
              },
            ],
          },
          { OR: [{ status: 0 }, { status: 1 }] },
        ],
      },
    });
    if (maybeMatch != null) return true;
    return false;
  }

  /** Compute win probability */
  _computeWinProbability(p1Rating: number, p2Rating: number): number {
    return 1 / (1 + Math.pow(10, (p2Rating - p1Rating) / 400));
  }

  /** Check if the players are not currently playing a match or disconnected */
  _arePlayersAvailable(p1: User, p2: User): boolean {
    // Check user status
    if (
      p1.currentStatus === this.userService.userStatus.AWAY ||
      p1.currentStatus === this.userService.userStatus.PLAYING ||
      p2.currentStatus === this.userService.userStatus.AWAY ||
      p2.currentStatus === this.userService.userStatus.PLAYING
    )
      return false;

    // Check current games
    if (
      p1.matches.filter(
        (match) =>
          match.match.status === this.matchStatus.CREATED ||
          match.match.status === this.matchStatus.STARTED,
      ).length > 0 ||
      p2.matches.filter(
        (match) =>
          match.match.status === this.matchStatus.CREATED ||
          match.match.status === this.matchStatus.STARTED,
      ).length > 0
    )
      return false;
    return true;
  }

  /** create a new match */
  async create(createMatchDto: CreateMatchDto): Promise<Match> {
    // check if the match is between two different players
    if (createMatchDto.idPlayer1 === createMatchDto.idPlayer2)
      throw new MatchWithOnePlayerException();

    // Check if a match between the 2 users is existing (throw error if yes)
    if (await this._isMatchExists(createMatchDto))
      throw new MatchAlreadyExistsException();

    // retrieve the two players
    const p1: User = await this.prisma.user.findUnique({
      where: { id: createMatchDto.idPlayer1 },
      include: { matches: true },
    });
    const p2: User = await this.prisma.user.findUnique({
      where: { id: createMatchDto.idPlayer1 },
      include: { matches: true },
    });
    if (!p1 || !p2)
      throw new UserNotFoundException(
        p1 ? createMatchDto.idPlayer2 : createMatchDto.idPlayer1,
      );

    // Check if one of the player is already in a non finished match
    if (!this._arePlayersAvailable(p1, p2))
      throw new PlayersNotAvailableException();

    // Calculate win probability for player 1 and player 2
    const wp1: number = this._computeWinProbability(p1.eloRating, p2.eloRating);
    const wp2: number = this._computeWinProbability(p2.eloRating, p1.eloRating);

    // Create a new match (try catch for user connection fail)
    const match = await this.prisma.match.create({
      data: {
        players: {
          createMany: {
            data: [
              {
                playerId: createMatchDto.idPlayer1,
                winProbability: wp1,
              },
              {
                playerId: createMatchDto.idPlayer2,
                playerNum: 2,
                winProbability: wp2,
              },
            ],
          },
        },
      },
    });
    return match;
  }

  findAll() {
    return `This action returns all match`;
  }

  findOne(id: number) {
    return `This action returns a #${id} match`;
  }

  update(id: number, updateMatchDto: UpdateMatchDto) {
    return `This action updates a #${id} match`;
  }

  remove(id: number) {
    return `This action removes a #${id} match`;
  }
}
