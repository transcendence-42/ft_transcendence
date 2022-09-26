import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RatingService } from 'src/rating/rating.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { Match } from './entities/match.entity';
import {
  MatchNotFoundException,
  NoMatchesInDatabaseException,
  NotEnoughPlayersException,
  BadRequestException,
} from './exceptions/';

@Injectable()
export class MatchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly ratingService: RatingService,
  ) {}

  readonly includedMatchRelations: object = {
    players: {
      include: {
        player: true,
      },
    },
  };

  /** Compute win probability */
  private _computeWinProbability(p1Rating: number, p2Rating: number): number {
    return 1 / (1 + Math.pow(10, (p2Rating - p1Rating) / 400));
  }

  /** Player status check */
  private _isStatusOk(status: number): boolean {
    return status !== null && +status >= 0 && +status <= 2;
  }

  /** create a new match */
  async create(createMatchDto: CreateMatchDto): Promise<Match> {
    // check number of players
    if (createMatchDto.players.length < 2)
      throw new NotEnoughPlayersException();
    // retrieve the two players
    const iLeft = createMatchDto.players.findIndex((p) => p.side === 0);
    const iRight = createMatchDto.players.findIndex((p) => p.side === 1);
    // Check sides
    if (iLeft === -1 || iRight === -1) throw new BadRequestException();
    // Check status
    if (
      createMatchDto.players[iLeft].status ===
        createMatchDto.players[iRight].status ||
      !this._isStatusOk(createMatchDto.players[iLeft].status) ||
      !this._isStatusOk(createMatchDto.players[iRight].status)
    )
      throw new BadRequestException();
    const pLeft: User = await this.userService.findOne(
      createMatchDto.players[iLeft].playerId,
    );
    const pRight: User = await this.userService.findOne(
      createMatchDto.players[iRight].playerId,
    );

    // Create a new match
    const match = await this.prisma.match.create({
      data: {
        players: {
          createMany: {
            data: [
              {
                side: 0,
                playerId: createMatchDto.players[iLeft].playerId,
                status: createMatchDto.players[iLeft].status,
                score: createMatchDto.players[iLeft].score,
              },
              {
                side: 1,
                playerId: createMatchDto.players[iRight].playerId,
                status: createMatchDto.players[iRight].status,
                score: createMatchDto.players[iRight].score,
              },
            ],
          },
        },
      },
    });

    // Update players ranking and stats
    await this._updatePlayersRankingAndStats(
      pLeft,
      pRight,
      iLeft,
      iRight,
      createMatchDto,
    );

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

  /** Update players ranking and stats after a match */
  async _updatePlayersRankingAndStats(
    pLeft: User,
    pRight: User,
    iLeft: number,
    iRight: number,
    createMatchDto: CreateMatchDto,
  ): Promise<User> {
    let pLeftNewElo: number;
    let pRightNewElo: number;
    let pLeftNewStats: object;
    let pRightNewStats: object;

    // Calculate win probability for player 1 and player 2
    const wpLeft: number = this._computeWinProbability(
      pLeft.eloRating,
      pRight.eloRating,
    );
    const wpRight: number = this._computeWinProbability(
      pRight.eloRating,
      pLeft.eloRating,
    );

    if (createMatchDto.players[iLeft].status === 0) {
      // Player left wins
      pLeftNewElo = pLeft.eloRating + 32 * (1 - wpLeft);
      pRightNewElo = pRight.eloRating + 32 * (0 - wpRight);
      pLeftNewStats = { update: { wins: { increment: 1 } } };
      pRightNewStats = { update: { losses: { increment: 1 } } };
    } else if (createMatchDto.players[iRight].status === 0) {
      // Player right wins
      pLeftNewElo = pLeft.eloRating + 32 * (0 - wpLeft);
      pRightNewElo = pRight.eloRating + 32 * (1 - wpRight);
      pLeftNewStats = { update: { losses: { increment: 1 } } };
      pRightNewStats = { update: { wins: { increment: 1 } } };
    }
    // Create a new entry in user's rating history after each match
    await this.ratingService.create({
      userId: pLeft.id,
      rating: Math.round(pLeftNewElo),
    });
    await this.userService.update(pLeft.id, {
      eloRating: Math.round(pLeftNewElo),
      stats: pLeftNewStats,
    });
    return await this.userService.update(pRight.id, {
      eloRating: Math.round(pRightNewElo),
      stats: pRightNewStats,
    });
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
