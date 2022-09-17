import { Inject, Injectable } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { Game, Player, Physic, Vector, GamePhysics } from './entities/';
import { v4 } from 'uuid';
import {
  UserAlreadyInGameException,
  GameNotFoundException,
  PlayerNotFoundException,
} from './exceptions/';
import { MatchService } from 'src/match/match.service';
import { CreateMatchDto } from 'src/match/dto/create-match.dto';
import Redis from 'redis';

// Enums
const enum Move {
  UP = 0,
  DOWN,
}

const enum Body {
  PADDLE = 0,
  BALL,
  WALL,
  GOAL,
}

const enum Wall {
  TOP = 0,
  BOTTOM,
}

const enum Side {
  LEFT = 0,
  RIGHT,
}

const enum Status {
  CREATED = 0,
  STARTED,
  FINISHED,
  NEWBALL,
}

const enum Motive {
  WIN = 0,
  LOSE,
  ABANDON,
  CANCEL,
}

const Params = Object.freeze({
  LOBBY: 'lobby',
  CANVASW: 900,
  CANVASH: 500,
  BALLSPEED: 6,
  PLAYERSPEED: 10,
  BARWIDTH: 12,
  BARHEIGHT: 54,
  WALLSIZE: 15,
  BALLSIZE: 12,
  BALL_ACCELERATION_TIME: 10,
  BALL_MAX_SPEED: 12,
});

@Injectable()
export class GameService {
  constructor(
    private readonly matchService: MatchService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis.RedisClientType,
  ) {
    this.games = [];
    this.players = [];
  }

  server: Server;
  games: Game[];
  players: Player[];

  /** *********************************************************************** */
  /** SOCKET                                                                  */
  /** *********************************************************************** */

  /** client connection */
  clientConnection(client: Socket) {
    // get query information
    const userId: number = +client.handshake.query.userId;
    console.log(`user number : ${userId} (${client.id}) connected !`);
    // if the user id is in a game, reconnect the client to the game
    //if (await this.redis.sIsMember('inGame', userId.toString()))
    const game = this.games.find(
      (game) =>
        game.players.filter((player) => player.userId === +userId).length === 1,
    );
    if (game) {
      client.join(game.id);
      client.emit('reconnect', game.id);
    } else {
      client.join(Params.LOBBY);
      if (this.server)
        this.server.to(Params.LOBBY).emit('info', {
          message: `user ${userId} (${client.id}) joined the lobby`,
        });
    }
  }

  /** client disconnection */
  clientDisconnection(client: Socket) {
    const userId: number = +client.handshake.query.userId;
    console.log(`user : ${userId} (${client.id}) disconnected`);
    // Broadcast that user left the lobby
    this.server.to(Params.LOBBY).emit('info', {
      message: `user ${userId} (${client.id}) left the lobby`,
    });
    // Warn the room if the player is in game
    const isGame = this.games.findIndex(
      (game) =>
        game.players.filter((player) => player.userId === +userId).length === 1,
    );
    if (isGame !== -1 && this.server)
      this.server.to(this.games[isGame].id).emit('info', {
        message: `user ${userId} (${client.id}) has left.`,
        data: { userId: userId },
      });
  }

  /** *********************************************************************** */
  /** GAME                                                                    */
  /** *********************************************************************** */

  /** Add player to a game and set his side */
  private _addPlayerToGame(player: Player, side: number, game: Game): Game {
    // check if user is already in game
    if (this._isPlayerInGame(player.userId)) {
      throw new UserAlreadyInGameException(player.userId);
    }
    // Add it to the game and set his side
    player.socket.leave(Params.LOBBY);
    player.socket.join(game.id);
    game.players.push({
      ...player,
      side: side,
      score: 0,
    });
    return game;
  }

  /** Check if a player is already in a game */
  private _isPlayerInGame(userId: number): boolean {
    if (
      this.games.find((game) =>
        game.players.find((player) => player.userId === userId),
      )
    )
      return true;
    return false;
  }

  /** Check if a viewer is already in a game */
  private _isViewerInGame(userId: number): boolean {
    if (
      this.games.find((game) =>
        game.viewers.find((viewer) => viewer.userId === userId),
      )
    )
      return true;
    return false;
  }

  /** Get the side of a player in a game from his id */
  private _getSideFromUser(game: Game, userId: number): number {
    const player: Player = game.players.find(
      (player) => player.userId === userId,
    );
    if (!player) throw new PlayerNotFoundException(userId);
    return player.side;
  }

  /** Create the game list from the global server data */
  private _createGameList(): object {
    const gameList = this.games.map((game) => {
      return {
        id: game.id,
        players: game.players.map((p) => ({
          userId: p.userId,
          pic: p.pic,
          name: p.name,
          score: p.score,
        })),
        viewersCount: game.viewers.length,
      };
    });
    return gameList;
  }

  /** Cancel game */
  private _cancelGame(game: Game) {
    this.games = this.games.filter((g) => g.id !== game.id);
    this.server.in(game.id).socketsJoin(Params.LOBBY);
    this.server.in(game.id).socketsLeave(game.id);
    // send a fresh gamelist to the lobby
    const gameList = this._createGameList();
    this.server.to(Params.LOBBY).emit('gameList', gameList);
  }

  /** End a game */
  private async _endGame(game: Game, motive: number, loserId?: number) {
    // remove the game from the list
    this.games = this.games.filter((g) => g.id !== game.id);
    // emit a game end info to all players / viewers so they go back to lobby
    this.server.to(game.id).emit('gameEnd', motive);
    // disconnect players / viewers from game room and connect them to lobby
    this.server.in(game.id).socketsJoin(Params.LOBBY);
    this.server.in(game.id).socketsLeave(game.id);
    // send a fresh gamelist to the lobby
    const gameList = this._createGameList();
    this.server.to(Params.LOBBY).emit('gameList', gameList);
    // save game result in database
    const createMatchDto: CreateMatchDto = {
      players: game.players.map((p) => ({
        playerId: p.userId,
        side: p.side,
        score: p.score,
        status: p.userId === loserId ? (motive === Motive.ABANDON ? 2 : 1) : 0,
      })),
    };
    try {
      await this.matchService.create(createMatchDto);
    } catch (e) {
      console.debug(e);
    }
  }

  /** Create a new game */
  create(players: Player[]) {
    // 1 : Chech if one of the user is already in a game or in match making
    players.forEach((p) => {
      if (this._isPlayerInGame(p.userId))
        throw new UserAlreadyInGameException(p.userId);
      const isMatchMaking = this.players.find((m) => m.userId === p.userId);
      if (isMatchMaking)
        this.players = this.players.filter((m) => m.userId !== p.userId);
    });
    // create a new game
    const newGame: Game = new Game(v4());
    const len = this.games.push(newGame);
    let game = this.games[len - 1];
    // add players to the game and give them the game id
    players.forEach((player, index) => {
      const side = index ? Side.RIGHT : Side.LEFT;
      game = this._addPlayerToGame(player, side, game);
      player.socket.emit('gameId', { id: game.id });
    });
    // Broadcast new gamelist to the lobby
    const gameList = this._createGameList();
    this.server.to(Params.LOBBY).emit('gameList', gameList);
    // start game if players > 1
    if (this.games[len - 1].players.length > 1) this._startGame(game);
  }

  /** Find all created games */
  findAll(client: Socket) {
    const gameList = this._createGameList();
    client.emit('gameList', gameList);
  }

  /** one viewer leave the game */
  viewerLeaves(client: Socket, id: string) {
    const userId: number = +client.handshake.query.userId;
    const game = this.games.find((game) => game.id === id);
    if (!game) throw new GameNotFoundException(id);
    // remove the viewer from game
    game.viewers = game.viewers.filter((v) => v.userId !== userId);
    // quit room and join lobby
    client.leave(game.id);
    client.join(Params.LOBBY);
    // resend game list to lobby
    const gameList = this._createGameList();
    this.server.to(Params.LOBBY).emit('gameList', gameList);
  }

  /** one player abandons the game */
  async abandonGame(client: Socket, id: string) {
    const userId: number = +client.handshake.query.userId;
    const game = this.games.find((game) => game.id === id);
    if (!game) throw new GameNotFoundException(id);
    if (game.players.length > 1)
      await this._endGame(game, Motive.ABANDON, userId);
    else this._cancelGame(game);
  }

  /** join a game (player) */
  join(client: Socket, id: string) {
    let game = this.games.find((game) => game.id === id);
    if (!game) throw new GameNotFoundException(id);
    // remove user from matchmaking
    const userId: number = +client.handshake.query.userId;
    const isMatchMaking = this.players.find((p) => p.userId === userId);
    if (isMatchMaking)
      this.players = this.players.filter((p) => p.userId !== userId);
    // add new player to the game and emit new grid
    const side = game.players.length > 1 ? Side.LEFT : Side.RIGHT;
    game = this._addPlayerToGame(new Player(client, userId), side, game);
    // Check if the game has 2 players
    if (game.players.length >= 2) {
      this._startGame(game);
    }
    // update the image with the new player for everyone
    this.server.to(game.id).emit('updateGrid', game.gameGrid);
    // update the lobby with the new player
    const gameList = this._createGameList();
    this.server.to(Params.LOBBY).emit('gameList', gameList);
  }

  /** view a game (viewer) */
  view(client: Socket, id: string) {
    const game = this.games.find((game) => game.id === id);
    if (!game) throw new GameNotFoundException(id);
    const userId: number = +client.handshake.query.userId;
    if (!this._isViewerInGame(userId)) {
      game.viewers.push({ socket: client, userId: userId });
    }
    client.join(game.id);
    client.leave(Params.LOBBY);
    // send a fresh gamelist to the lobby
    const gameList = this._createGameList();
    this.server.to(Params.LOBBY).emit('gameList', gameList);
  }

  /** reconnect a game (existing player) */
  reconnect(client: Socket, id: string) {
    const userId: number = +client.handshake.query.userId;
    const game = this.games.find((game) => game.id === id);
    if (!game) throw new GameNotFoundException(id);
    // update player socket on player list
    game.players = game.players.map((player) =>
      player.userId === userId ? { socket: client, ...player } : player,
    );
  }

  /** *********************************************************************** */
  /** MATCHMAKING                                                             */
  /** *********************************************************************** */

  /** handle player joining or leaving matchmaking */
  handleMatchMaking(client: Socket, value: boolean) {
    //add or remove the player
    const userId: number = +client.handshake.query.userId;
    const player: Player = this.players.find((p) => p.userId === userId);
    if (!player && value === true)
      this.players.push(new Player(client, userId));
    if (player && value === false)
      this.players.filter((p) => p.userId !== userId);
    // Find an opponent
    while (this.players.length > 1) {
      // Create a match with the two players
      const playersToMatch = this.players.filter((p, index) => index <= 1);
      playersToMatch.forEach((p) => {
        p.socket.emit('opponentFound');
      });
      setTimeout(() => {
        this.create(playersToMatch);
      }, 2001);
      // pop the players from the list
      this.players.shift();
      this.players.shift();
    }
  }

  /** *********************************************************************** */
  /** GAME GRID                                                               */
  /** *********************************************************************** */

  /** Init game grid */
  private _initGameGrid(game: Game) {
    // Players
    game.players.forEach((player) => {
      game.gameGrid.players.push({
        coordinates: {
          x: player.side === Side.LEFT ? 0 : Params.CANVASW - Params.BARWIDTH,
          y: Params.CANVASH / 2 - Params.BARHEIGHT / 2,
        },
        side: player.side,
      });
    });
    // Ball
    game.gameGrid.ball = new Vector(Params.CANVASW / 2, Params.CANVASH / 2);
    // Walls
    [
      {
        coordinates: { x: 0, y: 0 },
        side: Wall.TOP,
      },
      {
        coordinates: { x: 0, y: Params.CANVASH - Params.WALLSIZE },
        side: Wall.BOTTOM,
      },
    ].forEach((wall) => game.gameGrid.walls.push(wall));
  }

  /** Update grid from physics */
  private _updateGridFromPhysics(game: Game) {
    // Players
    game.gamePhysics.players.forEach((playerPhy) => {
      game.gameGrid.players.forEach((playerGrid, index) => {
        if (playerGrid.side === playerPhy.side)
          game.gameGrid.players[index].coordinates = playerPhy.coordinates;
      });
    });
    // Ball
    game.gameGrid.ball = game.gamePhysics.ball.coordinates;
  }

  /** get game grid on request */
  getGameGrid(client: Socket, id: string) {
    const game = this.games.find((game) => game.id === id);
    if (!game) throw new GameNotFoundException(id);
    client.emit('updateGrid', game.gameGrid);
    client.emit('updateScores', this._buildScoreObject(game));
  }

  /** *********************************************************************** */
  /** SCORES                                                                  */
  /** *********************************************************************** */

  /** Build a score object from a game */
  private _buildScoreObject(game: Game): any[] {
    const scores = game.players.map((player) => ({
      side: player.side,
      score: player.score,
    }));
    return scores;
  }

  /** Increase score for player */
  private _updateScore(side: number, game: Game) {
    game.players = game.players.map((player) =>
      player.side === side && player.updating === false
        ? { ...player, score: ++player.score, updating: true }
        : player,
    );
    this.server.to(Params.LOBBY).emit('gameList', this._createGameList());
  }

  /** Open scores for update */
  private _openPlayersScoreBoard(game: Game) {
    game.players = game.players.map((player) => ({
      ...player,
      updating: false,
    }));
  }

  /** *********************************************************************** */
  /** PHYSICS                                                                 */
  /** *********************************************************************** */

  /** Init game physics */
  private _initGamePhysics(game: Game) {
    // Players
    game.players.forEach((player) => {
      const pX =
        player.side === Side.RIGHT ? Params.CANVASW - Params.BARWIDTH : 0;
      game.gamePhysics.players.push({
        coordinates: {
          x: pX,
          y: Params.CANVASH / 2 - Params.BARHEIGHT / 2,
        },
        dimensions: { h: Params.BARHEIGHT, w: Params.BARWIDTH },
        direction: { x: 0, y: 1 },
        speed: 0,
        side: player.side,
        type: Body.PADDLE,
      });
    });
    // Walls
    [
      {
        coordinates: { x: 0, y: 0 },
        dimensions: { h: Params.WALLSIZE, w: Params.CANVASW },
        direction: { x: 1, y: 0 },
        side: Wall.TOP,
        type: Body.WALL,
      },
      {
        coordinates: { x: 0, y: Params.CANVASH - Params.WALLSIZE },
        dimensions: { h: Params.WALLSIZE, w: Params.CANVASW },
        direction: { x: 1, y: 0 },
        side: Wall.BOTTOM,
        type: Body.WALL,
      },
    ].forEach((wall) => game.gamePhysics.walls.push(wall));
    // Goals
    [
      {
        coordinates: { x: -Params.WALLSIZE, y: 0 },
        dimensions: { h: Params.CANVASH, w: Params.WALLSIZE },
        side: Side.LEFT,
        type: Body.GOAL,
      },
      {
        coordinates: { x: Params.CANVASW, y: 0 },
        dimensions: { h: Params.CANVASH, w: Params.WALLSIZE },
        side: Side.RIGHT,
        type: Body.GOAL,
      },
    ].forEach((goal) => game.gamePhysics.goals.push(goal));
    // Ball
    const startingSide = Math.round(Math.random());
    game.gamePhysics.ball.type = Body.BALL;
    game.gamePhysics.ball.coordinates = {
      x:
        startingSide === Side.LEFT
          ? Params.BARWIDTH + 10
          : Params.CANVASW - Params.BARWIDTH - 10,
      y: Math.floor(
        Math.random() *
          (Params.CANVASH -
            Params.WALLSIZE -
            Params.BALLSIZE -
            Params.WALLSIZE +
            1) +
          Params.WALLSIZE,
      ),
    };
    game.gamePhysics.ball.dimensions = {
      w: Params.BALLSIZE,
      h: Params.BALLSIZE,
    };
    // Ball initial direction and speed
    game.gamePhysics.ball.direction = {
      x: startingSide === Side.LEFT ? 1 : -1,
      y: Math.random(),
    };
    game.gamePhysics.ball.speed = Params.BALLSPEED;
    // Accelerate the ball every xx seconds
    if (game.gamePhysics.ball.timerFunction)
      clearInterval(game.gamePhysics.ball.timerFunction);
    game.gamePhysics.ball.timerFunction = setInterval(() => {
      this._accelerateBall(game);
    }, Params.BALL_ACCELERATION_TIME * 1000);
  }

  /** Reset game physics */
  private _resetGamePhysics(game: Game, side: number) {
    // Ball
    game.gamePhysics.ball.coordinates = {
      x:
        side === Side.RIGHT
          ? Params.BARWIDTH + 10
          : Params.CANVASW - Params.BARWIDTH - 10,
      y: Math.floor(
        Math.random() *
          (Params.CANVASH -
            Params.WALLSIZE -
            Params.BALLSIZE -
            Params.WALLSIZE +
            1) +
          Params.WALLSIZE,
      ),
    };
    // Ball initial direction and speed
    game.gamePhysics.ball.direction = {
      x: side === Side.RIGHT ? 1 : -1,
      y: Math.random(),
    };
    game.gamePhysics.ball.speed = Params.BALLSPEED;
    // Accelerate the ball every xx seconds
    if (game.gamePhysics.ball.timerFunction)
      clearInterval(game.gamePhysics.ball.timerFunction);
    game.gamePhysics.ball.timerFunction = setInterval(() => {
      this._accelerateBall(game);
    }, Params.BALL_ACCELERATION_TIME * 1000);
  }

  /** Accelerate ball */
  private _accelerateBall(game: Game) {
    if (game.gamePhysics.ball.speed < Params.BALL_MAX_SPEED)
      game.gamePhysics.ball.speed += 1;
  }

  /** Detect collision between 2 physic objects */
  private _isCollision(object1: Physic, object2: Physic): boolean {
    const { x: x1, y: y1 } = object1.coordinates;
    const { x: x2, y: y2 } = object2.coordinates;
    const { h: h1, w: w1 } = object1.dimensions;
    const { h: h2, w: w2 } = object2.dimensions;
    if (x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && h1 + y1 > y2) {
      return true;
    }
    return false;
  }

  /** Bounce a physic object by changing its vector */
  private _bounce(object: Physic, surface?: Physic): Physic {
    let updatedObject: Physic;

    if (object.type === Body.PADDLE) {
      updatedObject = {
        ...object,
        direction: {
          x: 0,
          y: object.direction.y * -1,
        },
      };
    } else if (object.type === Body.BALL) {
      // Ball
      const newDir: Vector = object.direction;
      // vs Wall
      if (surface.direction.x === 1) newDir.y = newDir.y * -1;
      // vs Paddle
      if (surface.direction.x === 0) newDir.x = newDir.x * -1;
      // Acceleration by contact
      if (surface.speed) newDir.y += surface.direction.y / 5;
      updatedObject = {
        ...object,
        direction: newDir,
      };
    }
    return updatedObject;
  }

  /** Update the physics from player's move */
  private _movePaddleFromInput(game: Game, userId: number, input: number) {
    // get the correct paddle
    const side: number = this._getSideFromUser(game, userId);
    const playerIndex = game.gamePhysics.players.findIndex(
      (player) => player.side === side,
    );
    const paddle: Physic = game.gamePhysics.players[playerIndex];
    // calculate the move to apply
    const move: number =
      input === Move.UP ? Params.PLAYERSPEED * -1 : Params.PLAYERSPEED;
    // handle possible collision
    let updatedPaddle: Physic = this._getUpdatedObject(paddle, move);
    if (
      this._isCollision(updatedPaddle, game.gamePhysics.walls[Wall.TOP]) ||
      this._isCollision(updatedPaddle, game.gamePhysics.walls[Wall.BOTTOM])
    ) {
      updatedPaddle = this._bounce(paddle);
    }
    game.gamePhysics.players[playerIndex] = updatedPaddle;
  }

  /** Get updated object */
  private _getUpdatedObject(object: Physic, input?: number): Physic {
    let updated: Physic;
    // Players
    const move = input ? input : object.speed * object.direction.y;
    if (object.type === Body.PADDLE) {
      updated = {
        ...object,
        coordinates: {
          x: object.coordinates.x,
          y: object.coordinates.y + move,
        },
        speed: input
          ? Params.PLAYERSPEED
          : object.speed - 1 > 0
          ? object.speed - 1
          : 0,
        direction: {
          x: 0,
          y: input ? (input > 0 ? 1 : -1) : object.direction.y,
        },
      };
    }
    // Ball
    if (object.type === Body.BALL) {
      updated = {
        ...object,
        coordinates: {
          x: object.coordinates.x + object.speed * object.direction.x,
          y: object.coordinates.y + object.speed * object.direction.y,
        },
      };
    }
    return updated;
  }

  /** Move the paddle forward with its speed and direction */
  private _movePaddleForward(paddle: Physic, world: GamePhysics): Physic {
    let updatedPaddle: Physic = this._getUpdatedObject(paddle);
    if (
      this._isCollision(updatedPaddle, world.walls[Wall.TOP]) ||
      this._isCollision(updatedPaddle, world.walls[Wall.BOTTOM])
    ) {
      updatedPaddle = this._bounce(paddle);
    }
    return updatedPaddle;
  }

  /** Move the ball forward with its speed and direction */
  private _moveBallForward(ball: Physic, game: Game): Physic {
    const world: GamePhysics = game.gamePhysics;
    let updatedBall: Physic = this._getUpdatedObject(ball);
    // if a goal is hit
    if (this._isCollision(updatedBall, world.goals[Side.LEFT])) {
      // score for right player
      this._updateScore(Side.RIGHT, game);
      this._initGame(game, Side.LEFT);
      return game.gamePhysics.ball;
    } else if (this._isCollision(updatedBall, world.goals[Side.RIGHT])) {
      // score for left player
      this._updateScore(Side.LEFT, game);
      this._initGame(game, Side.RIGHT);
      return game.gamePhysics.ball;
    }
    // if a wall or paddle is hit
    if (this._isCollision(updatedBall, world.walls[Wall.TOP]))
      updatedBall = this._bounce(ball, world.walls[Wall.TOP]);
    else if (this._isCollision(updatedBall, world.walls[Wall.BOTTOM]))
      updatedBall = this._bounce(ball, world.walls[Wall.BOTTOM]);
    else if (this._isCollision(updatedBall, world.players[Side.LEFT]))
      updatedBall = this._bounce(ball, world.players[Side.LEFT]);
    else if (this._isCollision(updatedBall, world.players[Side.RIGHT]))
      updatedBall = this._bounce(ball, world.players[Side.RIGHT]);
    return updatedBall;
  }

  /** Move the ball and players according to directions and speed */
  private _moveWorldForward(game: Game) {
    // Players
    const players: Physic[] = game.gamePhysics.players.map((player) =>
      this._movePaddleForward(player, game.gamePhysics),
    );
    game.gamePhysics.players = players;
    // Ball
    const ball: Physic = this._moveBallForward(game.gamePhysics.ball, game);
    game.gamePhysics.ball = ball;
  }

  /** initialize game */
  private _initGame(game: Game, side: number) {
    if (game.status === Status.CREATED) {
      this._initGameGrid(game);
      this._initGamePhysics(game);
    } else {
      this._resetGamePhysics(game, side);
    }
    this._openPlayersScoreBoard(game);
    this.server.to(game.id).emit('updateScores', this._buildScoreObject(game));
  }

  /** We have a winner */
  private _weHaveALoser(game: Game): number {
    const winner = game.players.find((p) => p.score === 9);
    const loser = game.players.find((p) => p.score < 9);
    if (winner && loser) return loser.userId;
    return -1;
  }

  /** Start a game */
  private _startGame(game: Game) {
    this._initGame(game, Side.RIGHT);
    game.status = Status.STARTED;
    const gameInterval = setInterval(() => {
      this._moveWorldForward(game);
      // check scores and end the game if one player scores 9
      const loserId = this._weHaveALoser(game);
      if (loserId !== -1) {
        this._endGame(game, Motive.WIN, loserId);
        clearInterval(gameInterval);
        return;
      }
      this._updateGridFromPhysics(game);
      this.server.to(game.id).emit('updateGrid', game.gameGrid);
    }, 30);
  }

  /** update a game (moves) */
  update(client: Socket, id: string, move: number) {
    const game = this.games.find((game) => game.id === id);
    if (!game) throw new GameNotFoundException(id);
    // Update player position if game started
    if (game.status === Status.STARTED) {
      // Update move
      const userId: number = +client.handshake.query.userId;
      this._movePaddleFromInput(game, userId, move);
    }
  }
}
