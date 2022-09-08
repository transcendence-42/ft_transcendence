import { Injectable } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game, Player, Physic, Vector, GamePhysics } from './entities/';
import { v4 } from 'uuid';
import {
  UserAlreadyInGameException,
  GameNotFoundException,
  PlayerNotFoundException,
} from './exceptions/';

// Enums
enum Move {
  UP = 0,
  DOWN,
}

enum PhyType {
  RECT = 0,
  CIRCLE,
}

enum Wall {
  TOP = 0,
  BOTTOM,
}

enum Side {
  LEFT = 0,
  RIGHT,
}

enum Status {
  CREATED = 0,
  STARTED,
  FINISHED,
}

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {
    this.games = [];
  }

  readonly LOBBY = 'lobby';

  readonly params = Object.freeze({
    CANVASW: 600,
    CANVASH: 600,
    BALLSPEED: 5,
    PLAYERSPEED: 10,
    BARWIDTH: 10,
    BARHEIGHT: 50,
    BALLRADIUS: 10,
    WALLSIZE: 15,
  });

  games: Game[];

  /** *********************************************************************** */
  /** SOCKET                                                                  */
  /** *********************************************************************** */

  /** client connection */
  clientConnection(client: Socket, server: Server, games: Game[]) {
    // get query information
    const userId: number = +client.handshake.query.userId;
    console.log(`user number : ${userId} (${client.id}) connected !`);
    // if the user id is in a game, reconnect the client to the game
    const game = games.find(
      (game) =>
        game.players.filter((player) => player.userId === +userId).length === 1,
    );
    if (game) {
      client.join(game.roomId);
      client.emit('reconnect', game.roomId);
    } else {
      client.join(this.LOBBY);
      server.to(this.LOBBY).emit('info', {
        message: `user ${userId} (${client.id}) joined the lobby`,
      });
    }
  }

  /** client disconnection */
  clientDisconnection(client: Socket, server: Server, games: Game[]) {
    const userId: number = +client.handshake.query.userId;
    console.log(`user : ${userId} (${client.id}) disconnected`);
    // Broadcast that user left the lobby
    server.to(this.LOBBY).emit('info', {
      message: `user ${userId} (${client.id}) left the lobby`,
    });
    // Warn the room if the player is in game
    const maybeGame = games.findIndex(
      (game) =>
        game.players.filter((player) => player.userId === +userId).length === 1,
    );
    if (maybeGame !== -1)
      server.to(games[maybeGame].roomId).emit('playerLeft', {
        message: `user ${userId} (${client.id}) left the lobby`,
        data: { userId: userId },
      });
  }

  /** *********************************************************************** */
  /** GAME                                                                    */
  /** *********************************************************************** */

  /** Add player to a game and set his side */
  private _addPlayerToGame(
    player: Socket,
    side: number,
    games: Game[],
    index: number,
  ): Game {
    const game = games[index];
    const userId: number = +player.handshake.query.userId;
    // check if user is already in game
    if (this._isPlayerInGame(userId, games)) {
      throw new UserAlreadyInGameException(userId);
    }
    // Add it to the game and set his side
    player.leave(this.LOBBY);
    player.join(game.roomId);
    game.players.push({
      socketId: player.id,
      userId: userId,
      side: side,
      score: 0,
    });
    return game;
  }

  /** Check if a player is already in a game */
  private _isPlayerInGame(userId: number, games: Game[]): boolean {
    if (
      games.find((game) =>
        game.players.find((player) => player.userId === userId),
      )
    )
      return true;
    return false;
  }

  /** Check if a viewer is already in a game */
  private _isViewerInGame(userId: number, games: Game[]): boolean {
    if (
      games.find((game) =>
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
  private _createGameList(games: Game[]): object {
    const gameList = games.map((game) => {
      return {
        roomId: game.roomId,
        players: game.players,
        viewersCount: game.viewers.length,
      };
    });
    return gameList;
  }

  /** Create a new game */
  create(players: Socket[], server: Server, games: Game[]) {
    // 1 : Chech if one of the user is already in a game
    players.forEach((player) => {
      const userId: number = +player.handshake.query.userId;
      if (this._isPlayerInGame(userId, games))
        throw new UserAlreadyInGameException(userId);
    });
    // create a new game
    const newGame: Game = new Game(v4());
    const len = games.push(newGame);
    // add players to the game and give them the game id
    players.forEach((player, index) => {
      const side = index ? Side.RIGHT : Side.LEFT;
      games[len - 1] = this._addPlayerToGame(player, side, games, len - 1);
      player.emit('newGameId', { id: games[len - 1].roomId });
    });
    // Broadcast new gamelist to the lobby
    const gameList = this._createGameList(games);
    server.to(this.LOBBY).emit('gameList', gameList);
    // start game if players > 1
    if (games[len - 1].players.length > 1)
      this._startGame(server, games[len - 1]);
  }

  /** Find all created games */
  findAll(client: Socket, games: Game[]) {
    const gameList = this._createGameList(games);
    client.emit('gameList', gameList);
  }

  /** one client intentionnaly leave the game (abandon) */
  leaveGame(client: Socket, server: Server, id: string, games: Game[]) {
    games = games.filter((game) => game.roomId !== id);
    // use prisma to update users and match info
  }

  /** join a game (player) */
  join(client: Socket, server: Server, id: string, games: Game[]) {
    const index = games.findIndex((game) => game.roomId === id);
    if (index === -1) throw new GameNotFoundException(id);
    // add new player to the game and emit new grid
    games[index] = this._addPlayerToGame(client, Side.RIGHT, games, index);
    // Check if the game has 2 players
    if (games[index].players.length >= 2) {
      this._startGame(server, games[index]);
    }
    // update the image with the new player for everyone
    server.to(games[index].roomId).emit('updateGrid', games[index].gameGrid);
    // update the lobby with the new player
    const gameList = this._createGameList(games);
    server.to(this.LOBBY).emit('gameList', gameList);
  }

  /** view a game (viewer) */
  view(client: Socket, id: string, games: Game[]) {
    const index = games.findIndex((game) => game.roomId === id);
    if (index === -1) throw new GameNotFoundException(id);
    const userId: number = +client.handshake.query.userId;
    if (!this._isViewerInGame(userId, games)) {
      games[index].viewers.push({ userId: userId, socketId: client.id });
    }
    client.join(games[index].roomId);
    client.leave(this.LOBBY);
  }

  /** reconnect a game (existing player) */
  reconnect(client: Socket, id: string, games: Game[]) {
    const userId: number = +client.handshake.query.userId;
    const index = games.findIndex((game) => game.roomId === id);
    if (index === -1) throw new GameNotFoundException(id);
    // update player socket on player list
    games[index].players = games[index].players.map((player) =>
      player.userId === userId ? { socketId: client.id, ...player } : player,
    );
  }

  /** *********************************************************************** */
  /** GAME GRID & SCORES                                                      */
  /** *********************************************************************** */

  /** Init game grid */
  private _initGameGrid(game: Game): Game {
    // Players
    game.players.forEach((player) => {
      game.gameGrid.players.push({
        coordinates: {
          x:
            player.side === Side.LEFT
              ? 50
              : this.params.CANVASW - 50 - this.params.BARWIDTH,
          y: this.params.CANVASH / 2 - this.params.BARHEIGHT / 2,
        },
        side: player.side,
      });
    });
    // Ball
    game.gameGrid.ball = new Vector(
      this.params.CANVASW / 2,
      this.params.CANVASH / 2,
    );
    return game;
  }

  /** Update grid from physics */
  private _updateGridFromPhysics(game: Game): Game {
    // Players
    game.gamePhysics.players.forEach((playerPhy) => {
      game.gameGrid.players.forEach((playerGrid, index) => {
        if (playerGrid.side === playerPhy.side)
          game.gameGrid.players[index].coordinates = playerPhy.coordinates;
      });
    });
    // Ball
    game.gameGrid.ball = game.gamePhysics.ball.coordinates;
    return game;
  }

  /** Build a score object from a game */
  private _buildScoreObject(game: Game): any[] {
    const scores = game.players.map((player) => ({
      side: player.side,
      score: player.score,
    }));
    return scores;
  }

  /** get game grid on request */
  getGameGrid(client: Socket, id: string, games: Game[]) {
    const index = games.findIndex((game) => game.roomId === id);
    if (index === -1) throw new GameNotFoundException(id);
    client.emit('updateGrid', games[index].gameGrid);
  }

  /** get game scores on request */
  getGameScores(client: Socket, id: string, games: Game[]) {
    const index = games.findIndex((game) => game.roomId === id);
    if (index === -1) throw new GameNotFoundException(id);
    // build score object
    const scores = this._buildScoreObject(games[index]);
    client.emit('updateScore', scores);
  }

  /** *********************************************************************** */
  /** PHYSICS                                                                 */
  /** *********************************************************************** */

  /** Init game physics from grid */
  private _initGamePhysics(game: Game): Game {
    // Players
    game.players.forEach((player) => {
      const pX =
        player.side === Side.RIGHT
          ? this.params.CANVASH - this.params.BARWIDTH - 50
          : 50;
      game.gamePhysics.players.push({
        coordinates: {
          x: pX,
          y: this.params.CANVASH / 2 - this.params.BARHEIGHT / 2,
        },
        dimensions: { h: this.params.BARHEIGHT, w: this.params.BARWIDTH },
        direction: { x: 0, y: 0 },
        speed: 0,
        side: player.side,
        type: PhyType.RECT,
      });
    });
    // Walls
    [
      {
        coordinates: { x: -this.params.WALLSIZE, y: -this.params.WALLSIZE },
        dimensions: {
          h: this.params.WALLSIZE,
          w: this.params.CANVASW + 2 * this.params.WALLSIZE,
        },
        direction: { x: 1, y: 0 },
        side: Wall.TOP,
        type: PhyType.RECT,
      },
      {
        coordinates: { x: -this.params.WALLSIZE, y: this.params.CANVASH },
        dimensions: {
          h: this.params.WALLSIZE,
          w: this.params.CANVASW + 2 * this.params.WALLSIZE,
        },
        direction: { x: 1, y: 0 },
        side: Wall.BOTTOM,
        type: PhyType.RECT,
      },
    ].forEach((wall) => game.gamePhysics.walls.push(wall));
    // Goals
    [
      {
        coordinates: { x: -this.params.WALLSIZE, y: 0 },
        dimensions: { h: this.params.CANVASH, w: this.params.WALLSIZE },
        side: Side.LEFT,
        type: PhyType.RECT,
      },
      {
        coordinates: { x: this.params.CANVASW, y: 0 },
        dimensions: { h: this.params.CANVASH, w: this.params.WALLSIZE },
        side: Side.RIGHT,
        type: PhyType.RECT,
      },
    ].forEach((goal) => game.gamePhysics.goals.push(goal));
    // Ball
    game.gamePhysics.ball.type = PhyType.CIRCLE;
    game.gamePhysics.ball.coordinates = {
      x: this.params.CANVASW / 2,
      y: this.params.CANVASH / 2,
    };
    game.gamePhysics.ball.dimensions = { r: this.params.BALLRADIUS };
    // Ball initial direction and speed
    game.gamePhysics.ball.direction = { x: Math.random(), y: Math.random() };
    game.gamePhysics.ball.speed = this.params.BALLSPEED;
    return game;
  }

  /** Detect collision between 2 physic objects */
  private _isCollision(object1: Physic, object2: Physic): boolean {
    // 2 RECT
    if (object1.type === PhyType.RECT && object2.type === PhyType.RECT) {
      if (
        object1.coordinates.x < object2.coordinates.x + object2.dimensions.w &&
        object1.coordinates.x + object1.dimensions.w > object2.coordinates.x &&
        object1.coordinates.y < object2.coordinates.y + object2.dimensions.h &&
        object1.dimensions.h + object1.coordinates.y > object2.coordinates.y
      ) {
        return true;
      }
    }
    // 1 RECT / 1 CIRCLE
    const circle: Physic = object1.type === PhyType.CIRCLE ? object1 : object2;
    const rect: Physic = object1.type === PhyType.RECT ? object1 : object2;
    const distX = Math.abs(
      circle.coordinates.x - rect.coordinates.x - rect.dimensions.w / 2,
    );
    const distY = Math.abs(
      circle.coordinates.y - rect.coordinates.y - rect.dimensions.h / 2,
    );
    if (distX > rect.dimensions.w / 2 + circle.dimensions.r) return false;
    if (distY > rect.dimensions.h / 2 + circle.dimensions.r) return false;
    if (distX <= rect.dimensions.w / 2) return true;
    if (distY <= rect.dimensions.h / 2) return true;
    const dx = distX - rect.dimensions.w / 2;
    const dy = distY - rect.dimensions.h / 2;
    return dx * dx + dy * dy <= circle.dimensions.r * circle.dimensions.r;
  }

  /** Bounce a physic object by changing its vector */
  private _bounce(object: Physic, surface?: Physic): Physic {
    let updatedObject: Physic;

    if (object.type === PhyType.RECT) {
      // Paddle
      updatedObject = {
        ...object,
        direction: {
          x: 0,
          y: object.direction.y * -1,
        },
      };
    } else {
      // Ball
      const newDir: Vector = object.direction;
      if (surface.direction.x === 1) newDir.y = newDir.y * -1;
      if (surface.direction.x === 0) newDir.x = newDir.x * -1;
      // Acceleration
      if (surface.speed) newDir.y += surface.direction.y / 10;
      updatedObject = {
        ...object,
        direction: newDir,
      };
    }
    return updatedObject;
  }

  /** Update the physics from player's move */
  private _movePaddleFromInput(
    game: Game,
    userId: number,
    input: number,
  ): Game {
    // get the correct paddle
    const side: number = this._getSideFromUser(game, userId);
    const playerIndex = game.gamePhysics.players.findIndex(
      (player) => player.side === side,
    );
    const paddle: Physic = game.gamePhysics.players[playerIndex];
    // calculate the move to apply
    const move: number =
      input === Move.UP
        ? this.params.PLAYERSPEED * -1
        : this.params.PLAYERSPEED;
    // handle possible collision
    let updatedPaddle: Physic = this._getUpdatedObject(paddle, move);
    if (
      this._isCollision(updatedPaddle, game.gamePhysics.walls[Wall.TOP]) ||
      this._isCollision(updatedPaddle, game.gamePhysics.walls[Wall.BOTTOM])
    ) {
      updatedPaddle = this._bounce(paddle);
    }
    game.gamePhysics.players[playerIndex] = updatedPaddle;
    return game;
  }

  /** Get updated object */
  private _getUpdatedObject(object: Physic, input?: number): Physic {
    let updated: Physic;
    // Players
    const move = input ? input : object.speed * object.direction.y;
    if (object.type === PhyType.RECT) {
      updated = {
        ...object,
        coordinates: {
          x: object.coordinates.x,
          y: object.coordinates.y + move,
        },
        speed: input
          ? this.params.PLAYERSPEED
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
    if (object.type === PhyType.CIRCLE) {
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
  private _moveBallForward(
    ball: Physic,
    game: Game,
    server: Server,
    gameInterval: NodeJS.Timer,
  ): Physic {
    const world: GamePhysics = game.gamePhysics;
    let updatedBall: Physic = this._getUpdatedObject(ball);
    if (this._isCollision(updatedBall, world.goals[Side.LEFT])) {
      // score for right player
      game.players.map((player) =>
        player.side === Side.RIGHT
          ? { ...player, score: ++player.score }
          : player,
      );
      server.to(game.roomId).emit('updateScores', this._buildScoreObject(game));
      clearInterval(gameInterval);
      this._startGame(server, game);
    } else if (this._isCollision(updatedBall, world.goals[Side.RIGHT])) {
      // score for left player
      game.players.map((player) =>
        player.side === Side.LEFT
          ? { ...player, score: ++player.score }
          : player,
      );
      server.to(game.roomId).emit('updateScores', this._buildScoreObject(game));
      this._startGame(server, game);
    }
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
  private _moveWorldForward(
    game: Game,
    server: Server,
    gameInterval: NodeJS.Timer,
  ): Game {
    // Players
    const players: Physic[] = game.gamePhysics.players.map((player) =>
      this._movePaddleForward(player, game.gamePhysics),
    );
    game.gamePhysics.players = players;
    // Ball
    const ball: Physic = this._moveBallForward(
      game.gamePhysics.ball,
      game,
      server,
      gameInterval,
    );
    game.gamePhysics.ball = ball;
    return game;
  }

  /** Start a game */
  private _startGame(server: Server, game: Game) {
    game = this._initGameGrid(game);
    game = this._initGamePhysics(game);
    game.status = Status.STARTED;
    const gameInterval = setInterval(() => {
      game = this._moveWorldForward(game, server, gameInterval);
      game = this._updateGridFromPhysics(game);
      server.to(game.roomId).emit('updateGrid', game.gameGrid);
    }, 20);
    //clearInterval(gameInterval);
  }

  /** update a game (moves) */
  update(
    client: Socket,
    server: Server,
    id: string,
    updateGameDto: UpdateGameDto,
    games: Game[],
  ) {
    const index = games.findIndex((game) => game.roomId === id);
    if (index === -1) throw new GameNotFoundException(id);
    // Update player position if game started
    if (games[index].status === Status.STARTED) {
      // Update move
      const userId: number = +client.handshake.query.userId;
      games[index] = this._movePaddleFromInput(
        games[index],
        userId,
        updateGameDto.move,
      );
    }
  }
}
