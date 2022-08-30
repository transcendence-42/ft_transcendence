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
  async _updatePlayersRanking(match: Match) {
    let p1NewElo: number;
    let p2NewElo: number;

    const player1: PlayerOnMatch = match.players[0];
    const player2: PlayerOnMatch = match.players[1];
    if (player1.playerScore > player2.playerScore) {
      // Player 1 wins
      p1NewElo = player1.player.eloRating + 32 * (1 - player1.winProbability);
      p2NewElo = player2.player.eloRating + 32 * (0 - player2.winProbability);
    } else if (player2.playerScore > player1.playerScore) {
      // Player 2 wins
      p1NewElo = player1.player.eloRating + 32 * (0 - player1.winProbability);
      p2NewElo = player2.player.eloRating + 32 * (1 - player2.winProbability);
    } else {
      // Draw
      p1NewElo = player1.player.eloRating + 32 * (0.5 - player1.winProbability);
      p2NewElo = player2.player.eloRating + 32 * (0.5 - player2.winProbability);
    }
    // Create a new entry in user's rating history after each match
    await this.ratingService.create({
      userId: player1.playerId,
      rating: p1NewElo,
    });
    await this.userService.update(player1.playerId, { eloRating: p1NewElo });
    await this.userService.update(player2.playerId, { eloRating: p2NewElo });
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
      // Update players ranking
      if (
        updateMatchDto.status &&
        updateMatchDto.status == this.matchStatus.FINISHED
      )
        await this._updatePlayersRanking(result);
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
          data: { playerScore: updateScoresDto.players[0].playerScore },
        },
        {
          where: { playerId: updateScoresDto.players[1].playerId },
          data: { playerScore: updateScoresDto.players[1].playerScore },
        },
      ];
    } else if (updateScoresDto.players[0]) {
      updateData = [
        {
          where: { playerId: updateScoresDto.players[0].playerId },
          data: { playerScore: updateScoresDto.players[0].playerScore },
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
