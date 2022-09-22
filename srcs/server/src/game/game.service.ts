import { Inject, Injectable } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { Game, Player, Physic, Vector, GamePhysics, Client } from './entities/';
import { v4 } from 'uuid';
import {
  UserAlreadyInGameException,
  GameNotFoundException,
  CannotPauseGameException,
  PlayerNotFoundException,
} from './exceptions/';
import { MatchService } from 'src/match/match.service';
import { CreateMatchDto } from 'src/match/dto/create-match.dto';
import Redis from 'redis';
import { Match } from 'src/match/entities/match.entity';
import { nickName } from './extra/surnames';

// Enums
const enum Move {
  UP = 0,
  DOWN,
}

const enum Body {
  PADDLE = 'paddle',
  BALL = 'ball',
  WALL = 'wall',
  GOAL = 'goal',
}

const enum Wall {
  TOP = 'top',
  BOTTOM = 'bottom',
}

const enum Side {
  LEFT = 'left',
  RIGHT = 'right',
}

const enum Status {
  CREATED = 'created',
  STARTED = 'started',
  FINISHED = 'finished',
  NEWBALL = 'newball',
  PAUSED = 'paused',
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
  PAUSE_TIME: 30,
});

const enum DB {
  GAMES = 0,
  PLAYERS,
  VIEWERS,
  MATCHMAKING,
  GRID,
  PHYSICS,
}

@Injectable()
export class GameService {
  constructor(
    private readonly matchService: MatchService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis.RedisClientType,
  ) {
    this.games = [];
    this.players = [];
    this.clients = [];
  }

  server: Server;
  games: Game[];
  players: Player[];
  clients: Client[];

  /** *********************************************************************** */
  /** SOCKET                                                                  */
  /** *********************************************************************** */

  /** add client to list */
  private _addOrUpdateClient(client: Socket) {
    const userId = client.handshake.query.userId.toString();
    const isClient = this.clients.find((c) => c.userId === userId);
    if (isClient) isClient.socket == client;
    else this.clients.push({ socket: client, userId: userId });
  }

  /** remove client from list */
  private _removeClient(client: Socket) {
    this.clients = this.clients.filter((c) => c.socket.id !== client.id);
  }

  /** get socket from id */
  private _getSocket(id: string): Socket {
    const client = this.clients.find((c) => c.userId === id);
    if (client) return client.socket;
    return null;
  }

  /** client connection */
  async clientConnection(client: Socket) {
    // get query information
    const userId: string = client.handshake.query.userId.toString();
    const userName: string = client.handshake.query.name.toString();
    console.log(`user number : ${userId} (${client.id}) connected !`);
    // add client to the server list
    this._addOrUpdateClient(client);
    // if the user id is in a game, reconnect the client to the game
    await this.redis.select(DB.PLAYERS);
    const gameId: any = await this.redis.get(userId);
    if (gameId) {
      client.join(gameId);
      client.emit('reconnect', gameId);
    } else {
      client.join(Params.LOBBY);
      if (this.server)
        this.server.to(Params.LOBBY).emit('info', {
          message: `${userName}, ${nickName()}, joined the lobby`,
        });
    }
  }

  /** client disconnection */
  async clientDisconnection(client: Socket) {
    // get query information
    const userId: string = client.handshake.query.userId.toString();
    const userName: string = client.handshake.query.name.toString();
    console.log(`user : ${userName} disconnected`);
    // Remove client from server
    this._removeClient(client);
    // Broadcast that user left the lobby
    this.server.to(Params.LOBBY).emit('info', {
      message: `${userName} left the lobby`,
    });
    // Warn the room if the player is in game
    await this.redis.select(DB.PLAYERS);
    const gameId: any = await this.redis.get(userId);
    if (gameId && this.server)
      this.server.to(gameId).emit('info', {
        message: `${userName} has left.`,
        data: { userId: userId },
      });
  }

  /** *********************************************************************** */
  /** GAME                                                                    */
  /** *********************************************************************** */

  /** Add player to a game and set his side */
  private async _addPlayerToGame(player: Player, side: string, game: Game) {
    // Add it to the game room and leave lobby
    player.socket.leave(Params.LOBBY);
    player.socket.join(game.id);
    // Add player in player db with its game for further checks
    await this.redis.select(DB.PLAYERS);
    await this.redis.set(player.userId, game.id);
    // Complete information on game db
    game.players.push({
      userId: player.userId,
      side: side,
    });
  }

  /** Check if a player is already in a game */
  private async _isPlayerInGame(userId: string): Promise<boolean> {
    await this.redis.select(DB.PLAYERS);
    return (await this.redis.get(userId)) !== null;
  }

  /** Check if a viewer is already in a game */
  private async _isViewerInGame(userId: string): Promise<boolean> {
    await this.redis.select(DB.VIEWERS);
    return (await this.redis.hGet(userId, 'gameId')) !== null;
  }

  /** Get the side of a player in a game from his id */
  private _getSideOfPlayer(game: Game, userId: string): string {
    const player: Player = game.players.find((p) => p.userId === userId);
    if (!player) throw new PlayerNotFoundException(userId);
    return player.side;
  }

  /** Create the game list from the global server data */
  private async _createGameList(): Promise<Game[]> {
    await this.redis.select(DB.GAMES);
    let games: any = [];
    let gameKeys: string[] = await this.redis.keys('*');
    gameKeys = gameKeys.filter((k: string) => k !== 'ping');
    if (gameKeys.length > 0)
      games = (await this.redis.json.mGet(gameKeys, '$')).flat(1);
    const gameList = games.map((g: any) => {
      return {
        id: g.id,
        players: g.players.map((p: any) => ({
          userId: p.userId,
          pic: p.pic,
          name: p.name,
          score: p.score,
        })),
        viewersCount: g.viewers.length,
      };
    });
    return gameList;
  }

  /** Remove game */
  private async _removeGame(gameId: string) {
    // remove players
    const players: any = await this.redis.json.get(gameId, {
      path: '$.players',
    });
    await this.redis.select(DB.PLAYERS);
    players.forEach(async (p: any) => {
      await this.redis.del(p.userId);
    });
    // remove viewers
    const viewers: any = await this.redis.json.get(gameId, {
      path: '$.viewers',
    });
    await this.redis.select(DB.VIEWERS);
    viewers.forEach(async (v: any) => {
      await this.redis.del(v.userId);
    });
    // remove the game from the list in storage
    await this.redis.select(DB.GAMES);
    await this.redis.del(gameId);
  }

  /** Cancel game */
  private async _cancelGame(gameId: string) {
    this.server.in(gameId).socketsJoin(Params.LOBBY);
    this.server.in(gameId).socketsLeave(gameId);
    await this._removeGame(gameId);
    // send a fresh gamelist to the lobby
    const gameList = await this._createGameList();
    this.server.to(Params.LOBBY).emit('gameList', gameList);
  }

  /** End a game */
  private async _endGame(
    gameId: string,
    motive: number,
    loserId?: string,
  ): Promise<Match> {
    // emit a game end info to all players / viewers so they go back to lobby
    this.server.to(gameId).emit('gameEnd', motive);
    // disconnect players / viewers from game room and connect them to lobby
    this.server.in(gameId).socketsJoin(Params.LOBBY);
    this.server.in(gameId).socketsLeave(gameId);
    // save game result in database
    const game: any = await this.redis.json.get(gameId, { path: '$' });
    const createMatchDto: CreateMatchDto = {
      players: game.players.map((p: any) => ({
        playerId: p.userId,
        side: p.side,
        score: p.score,
        status: p.userId === loserId ? (motive === Motive.ABANDON ? 2 : 1) : 0,
      })),
    };
    // remove the game from the list
    await this._removeGame(gameId);
    // send a fresh gamelist to the lobby
    const gameList = await this._createGameList();
    this.server.to(Params.LOBBY).emit('gameList', gameList);
    // Save result
    try {
      return await this.matchService.create(createMatchDto);
    } catch (e) {
      console.debug(e);
    }
  }

  /** get Game */
  private async _getGame(id: string): Promise<any> {
    await this.redis.select(DB.GAMES);
    const game: any = await this.redis.json.GET(id, { path: '$' });
    if (!game) throw new GameNotFoundException(id);
    console.log('game:');
    console.log(game[0]);
    return game[0];
  }

  /** Create a new game */
  async create(players: Player[]) {
    // Check if one of the user is already in a game or in match making
    players.forEach(async (p) => {
      if (await this._isPlayerInGame(p.userId))
        throw new UserAlreadyInGameException(p.userId);
      const isMatchMaking = await this.redis.sIsMember('matchMaking', p.userId);
      if (isMatchMaking) await this.redis.sRem('matchMaking', p.userId);
    });
    // create a new game
    const newGame: Game = new Game(v4());
    // add players to the game and give them the game id
    players.forEach(async (p, i) => {
      const side: string = i ? Side.RIGHT : Side.LEFT;
      await this._addPlayerToGame(p, side, newGame);
      p.socket.emit('gameId', { id: newGame.id });
    });
    // update game on redis
    await this.redis.select(DB.GAMES);
    await this.redis.json.set(
      newGame.id,
      '$',
      JSON.parse(JSON.stringify(newGame)),
    );
    // Broadcast new gamelist to the lobby
    const gameList = await this._createGameList();
    this.server.to(Params.LOBBY).emit('gameList', gameList);
    // start game if players > 1
    if (players.length > 1) await this._startGame(newGame.id);
  }

  /** Find all created games */
  async findAll(client: Socket) {
    const gameList = await this._createGameList();
    client.emit('gameList', gameList);
  }

  /** one viewer leave the game */
  async viewerLeaves(client: Socket, id: string) {
    // get the game
    await this.redis.select(DB.GAMES);
    const game: any = await this.redis.json.get(id, { path: '$' });
    if (!game) throw new GameNotFoundException(id);
    // remove the viewer
    const userId: string = client.handshake.query.userId.toString();
    await this.redis.json.del(id, `$.viewers['${userId}']`);
    await this.redis.select(DB.VIEWERS);
    await this.redis.del(userId);
    // quit room and join lobby
    client.leave(id);
    client.join(Params.LOBBY);
    // resend game list to lobby
    const gameList = await this._createGameList();
    this.server.to(Params.LOBBY).emit('gameList', gameList);
  }

  /** one player abandons the game */
  async abandonGame(client: Socket, id: string): Promise<Match> {
    await this.redis.select(DB.GAMES);
    const game: any = (await this.redis.json.get(id, { path: '$' }))[0];
    if (!game) throw new GameNotFoundException(id);
    const userId: string = client.handshake.query.userId.toString();
    if (game.players.length > 1)
      return await this._endGame(id, Motive.ABANDON, userId);
    else await this._cancelGame(id);
  }

  /** pause a game */
  async pause(client: Socket, id: string) {
    // Get game and player
    const game: Game = await this._getGame(id);
    const userId: string = client.handshake.query.userId.toString();
    const player: Player = game.players.find((p) => p.userId === userId);
    // check if game is already paused
    if (game.status === Status.PAUSED)
      throw new CannotPauseGameException('the game is already paused');
    // check if user can pause the game
    if (player.pauseCount === 0) {
      throw new CannotPauseGameException('you have used all your pauses');
    }
    // Pause the game and unpause it after a delay with a callback
    game.status === Status.PAUSED;
    game.players.map((p) =>
      p.userId === userId ? { ...p, pauseCount: --p.pauseCount } : p,
    );
    const ballSpeed = game.gamePhysics.ball.speed;
    // update redis
    await this.redis.json.set(id, '$', JSON.parse(JSON.stringify(game)));
    this.server.to(id).emit('pause', +Params.PAUSE_TIME);
    // UnPause after a delay
    setTimeout(async () => {
      await this.redis.select(DB.GAMES);
      if (await this.redis.exists(id)) {
        await this.redis.json.set(id, '$.status', Status.STARTED);
        await this.redis.json.set(id, '$.gamePhysics.ball.speed', ballSpeed);
      }
    }, Params.PAUSE_TIME * 1000);
  }

  /** join a game (player) */
  async join(client: Socket, id: string) {
    // Get game
    const game: any = await this._getGame(id);
    // remove user from matchmaking
    const userId: string = client.handshake.query.userId.toString();
    await this.redis.select(DB.MATCHMAKING);
    if (await this.redis.sIsMember('users', userId))
      await this.redis.sRem('users', userId);
    // add new player to the game and emit new grid
    await this._addPlayerToGame(
      new Player(client, userId),
      Side.RIGHT,
      game.id,
    );
    // Start game
    await this._startGame(id);
    // update the lobby with the new player
    const gameList = await this._createGameList();
    this.server.to(Params.LOBBY).emit('gameList', gameList);
  }

  /** view a game (viewer) */
  async view(client: Socket, id: string) {
    // Get game
    await this._getGame(id);
    const userId: string = client.handshake.query.userId.toString();
    // Add the user as a viewer
    await this.redis.select(DB.VIEWERS);
    await this.redis.set(userId, id);
    // Complete information on game db
    await this.redis.select(DB.GAMES);
    await this.redis.json.set(id, `$.viewer[${userId}]`, { userId: userId });
    client.join(id);
    client.leave(Params.LOBBY);
    // send a fresh gamelist to the lobby
    const gameList = await this._createGameList();
    this.server.to(Params.LOBBY).emit('gameList', gameList);
  }

  /** reconnect a game (existing player) */
  async reconnect(client: Socket, id: string) {
    // Get game
    const game: any = await this._getGame(id);
  }

  /** *********************************************************************** */
  /** MATCHMAKING                                                             */
  /** *********************************************************************** */

  /** handle player joining or leaving matchmaking */
  async handleMatchMaking(client: Socket, value: boolean) {
    // add or remove the player
    const userId: string = client.handshake.query.userId.toString();
    await this.redis.select(DB.MATCHMAKING);
    if (await this.redis.exists(userId)) {
      if (value) await this.redis.sAdd('users', userId);
      if (!value) await this.redis.sRem('users', userId);
    }
    // MaaaaatchMakiiiing
    const len = (await this.redis.sMembers('users')).length;
    while (len > 1) {
      // Create a match with the two players
      const p1 = await this.redis.sPop('users');
      const p2 = await this.redis.sPop('users');
      const playersToMatch = [];
      playersToMatch.push({ userId: p1 });
      playersToMatch.push({ userId: p2 });
      playersToMatch.forEach((p) => {
        this._getSocket(p.userId).emit('opponentFound');
      });
      setTimeout(() => {
        this.create(playersToMatch);
      }, 2001);
    }
  }

  /** *********************************************************************** */
  /** GAME GRID                                                               */
  /** *********************************************************************** */

  /** Init game grid */
  private _initGameGrid(game: Game) {
    // Players
    game.players.forEach((p: any) => {
      game.gameGrid.players.push({
        coordinates: {
          x: p.side === Side.LEFT ? 0 : Params.CANVASW - Params.BARWIDTH,
          y: Params.CANVASH / 2 - Params.BARHEIGHT / 2,
        },
        side: p.side,
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
  async getGameGrid(client: Socket, id: string) {
    // read from redis
    const game = await this._getGame(id);
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
  private _updateScore(side: string, game: Game) {
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
    game.players.forEach((p: any) => {
      const pX = p.side === Side.RIGHT ? Params.CANVASW - Params.BARWIDTH : 0;
      game.gamePhysics.players.push({
        coordinates: {
          x: pX,
          y: Params.CANVASH / 2 - Params.BARHEIGHT / 2,
        },
        dimensions: { h: Params.BARHEIGHT, w: Params.BARWIDTH },
        direction: { x: 0, y: 1 },
        speed: 0,
        side: p.side,
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
        startingSide === 0
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
      x: startingSide === 0 ? 1 : -1,
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
  private _resetGamePhysics(game: Game, side: string) {
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
  private _movePaddleFromInput(game: Game, userId: string, input: number) {
    // get the correct paddle
    const side: string = this._getSideOfPlayer(game, userId);
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
    const players: Physic[] = game.gamePhysics.players.map((p) =>
      this._movePaddleForward(p, game.gamePhysics),
    );
    game.gamePhysics.players = players;
    // Ball
    const ball: Physic = this._moveBallForward(game.gamePhysics.ball, game);
    game.gamePhysics.ball = ball;
  }

  /** initialize game */
  private _initGame(game: Game, side: string) {
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
  private _weHaveALoser(game: Game): string {
    const winner = game.players.find((p) => p.score === 9);
    const loser = game.players.find((p) => p.score < 9);
    if (winner && loser) return loser.userId;
    return '';
  }

  /** Start a game */
  private async _startGame(id: string) {
    // read from redis
    let game = await this._getGame(id);
    this._initGame(game, Side.RIGHT);
    await this.redis.select(DB.GAMES);
    await this.redis.json.set(id, `$.status`, Status.STARTED);
    game.status = Status.STARTED;
    const gameInterval = setInterval(async () => {
      if (game.status === Status.STARTED) {
        this._moveWorldForward(game);
        // check scores and end the game if one player scores 9
        const loserId = this._weHaveALoser(game);
        if (loserId !== '') {
          this._endGame(game.id, Motive.WIN, loserId);
          clearInterval(gameInterval);
          return;
        }
        this._updateGridFromPhysics(game);
        this.server.to(game.id).emit('updateGrid', game.gameGrid);
        // write in redis
        await this.redis.select(DB.GAMES);
        await this.redis.json.set(id, '$', JSON.parse(JSON.stringify(game)));
        // read from redis (to get players moves)
        game = await this._getGame(id);
      }
    }, 30);
  }

  /** update a game (moves) */
  async update(client: Socket, id: string, move: number) {
    // read from redis
    const game = await this._getGame(id);
    // Update player position if game started
    if (game.status === Status.STARTED) {
      // Update move
      const userId: string = client.handshake.query.userId.toString();
      this._movePaddleFromInput(game, userId, move);
      // write in redis
      await this.redis.select(DB.GAMES);
      await this.redis.json.set(id, '$', JSON.parse(JSON.stringify(game)));
    }
  }
}
