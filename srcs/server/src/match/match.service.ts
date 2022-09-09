import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RatingService } from 'src/rating/rating.service';
import { User } from 'src/user/entities/user.entity';
import { UserNotFoundException } from 'src/user/exceptions/';
import { UserService } from 'src/user/user.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { UpdateScoresDto } from './dto/update-scores.dto';
import { Match } from './entities/match.entity';
import { PlayerOnMatch } from './entities/playerOnMatch.entity';
import {
  MatchAlreadyExistsException,
  MatchNotFoundException,
  MatchWithOnePlayerException,
  NoMatchesInDatabaseException,
  PlayersNotAvailableException,
} from './exceptions/';

@Injectable()
export class MatchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly ratingService: RatingService,
  ) {}

  // MATCH CRUD OPERATIONS -----------------------------------------------------
  readonly includedMatchRelations: object = {
    players: {
      include: {
        player: true,
      },
    },
  };

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
                  some: { playerId: createMatchDto.idPlayerLeft },
                },
              },
              {
                players: {
                  some: { playerId: createMatchDto.idPlayerRight },
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
    if (createMatchDto.idPlayerLeft === createMatchDto.idPlayerRight)
      throw new MatchWithOnePlayerException();

    // Check if a match between the 2 users is existing (throw error if yes)
    if (await this._isMatchExists(createMatchDto))
      throw new MatchAlreadyExistsException();

    // retrieve the two players
    const pLeft: User = await this.prisma.user.findUnique({
      where: { id: createMatchDto.idPlayerLeft },
      include: { matches: true },
    });
    const pRight: User = await this.prisma.user.findUnique({
      where: { id: createMatchDto.idPlayerRight },
      include: { matches: true },
    });
    if (!pLeft || !pRight)
      throw new UserNotFoundException(
        pLeft ? createMatchDto.idPlayerRight : createMatchDto.idPlayerLeft,
      );

    // Check if one of the player is already in a non finished match
    if (!this._arePlayersAvailable(pLeft, pRight))
      throw new PlayersNotAvailableException();

    // Calculate win probability for player 1 and player 2
    const wpLeft: number = this._computeWinProbability(
      pLeft.eloRating,
      pRight.eloRating,
    );
    const wpRight: number = this._computeWinProbability(
      pRight.eloRating,
      pLeft.eloRating,
    );

    // Create a new match (try catch for user connection fail)
    const match = await this.prisma.match.create({
      data: {
        players: {
          createMany: {
            data: [
              {
                playerId: createMatchDto.idPlayerLeft,
                winProbability: wpLeft,
              },
              {
                playerId: createMatchDto.idPlayerRight,
                side: 1,
                winProbability: wpRight,
              },
            ],
          },
        },
      },
    });
    return match;
  }

  /** Find all matches */
  async findAll(paginationQuery: PaginationQueryDto): Promise<Match[]> {
    const { limit, offset } = paginationQuery;
    const query: object = {
      ...(limit && { take: +limit }),
      ...(offset && { skip: +offset }),
      include: this.includedMatchRelations,
    };
    const result: Match[] = await this.prisma.match.findMany(query);
    if (result.length == 0) throw new NoMatchesInDatabaseException();
    return result;
  }

  /** Find one match */
  async findOne(id: number): Promise<Match> {
    const result: Match | null = await this.prisma.match.findUnique({
      where: { id: id },
      include: this.includedMatchRelations,
    });
    if (result == null) throw new MatchNotFoundException(id);
    return result;
  }

  /** Update players ranking after a match */
  async _updatePlayersRankingAndStats(match: Match) {
    let p1NewElo: number;
    let p2NewElo: number;
    let p1NewStats: object;
    let p2NewStats: object;

    // P1 = left / P2 = Right
    const player1: PlayerOnMatch = match.players.find((p) => p.side === 0);
    const player2: PlayerOnMatch = match.players.find((p) => p.side === 1);
    if (player1.score > player2.score) {
      // Player 1 wins
      p1NewElo = player1.player.eloRating + 32 * (1 - player1.winProbability);
      p2NewElo = player2.player.eloRating + 32 * (0 - player2.winProbability);
      p1NewStats = { update: { wins: { increment: 1 } } };
      p2NewStats = { update: { losses: { increment: 1 } } };
    } else if (player2.score > player1.score) {
      // Player 2 wins
      p1NewElo = player1.player.eloRating + 32 * (0 - player1.winProbability);
      p2NewElo = player2.player.eloRating + 32 * (1 - player2.winProbability);
      p1NewStats = { update: { losses: { increment: 1 } } };
      p2NewStats = { update: { wins: { increment: 1 } } };
    } else {
      // Draw
      p1NewElo = player1.player.eloRating + 32 * (0.5 - player1.winProbability);
      p2NewElo = player2.player.eloRating + 32 * (0.5 - player2.winProbability);
      p1NewStats = {};
      p2NewStats = {};
    }
    // Create a new entry in user's rating history after each match
    await this.ratingService.create({
      userId: player1.playerId,
      rating: p1NewElo,
    });
    await this.userService.update(player1.playerId, {
      eloRating: p1NewElo,
      stats: p1NewStats,
    });
    await this.userService.update(player2.playerId, {
      eloRating: p2NewElo,
      stats: p2NewStats,
    });
  }

  /** Update one match */
  async update(id: number, updateMatchDto: UpdateMatchDto): Promise<Match> {
    try {
      // Update match in database
      const result: Match = await this.prisma.match.update({
        where: { id: id },
        data: { ...updateMatchDto },
        include: this.includedMatchRelations,
      });
      // Update players ranking & stats
      if (
        updateMatchDto.status &&
        updateMatchDto.status == this.matchStatus.FINISHED
      )
        await this._updatePlayersRankingAndStats(result);
      return result;
    } catch (e) {
      throw new MatchNotFoundException(id);
    }
  }

  /** Update match scores */
  async updateScores(
    id: number,
    updateScoresDto: UpdateScoresDto,
  ): Promise<Match> {
    // update data
    let updateData: Array<{
      where: { playerId: number };
      data: { playerScore: number };
    }>;
    if (updateScoresDto.players[1]) {
      updateData = [
        {
          where: { playerId: updateScoresDto.players[0].playerId },
          data: { playerScore: updateScoresDto.players[0].score },
        },
        {
          where: { playerId: updateScoresDto.players[1].playerId },
          data: { playerScore: updateScoresDto.players[1].score },
        },
      ];
    } else if (updateScoresDto.players[0]) {
      updateData = [
        {
          where: { playerId: updateScoresDto.players[0].playerId },
          data: { playerScore: updateScoresDto.players[0].score },
        },
      ];
    }
    try {
      // Update match scores in database
      const result: Match = await this.prisma.match.update({
        where: { id: id },
        data: {
          players: {
            updateMany: updateData,
          },
        },
        include: this.includedMatchRelations,
      });
      return result;
    } catch (e) {
      throw new MatchNotFoundException(id);
    }
  }

  /** Remove one match */
  async remove(id: number): Promise<Match> {
    try {
      const result: Match = await this.prisma.match.delete({
        where: { id: id },
      });
      return result;
    } catch (e) {
      throw new MatchNotFoundException(id);
    }
  }
}
