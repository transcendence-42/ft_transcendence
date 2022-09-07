import { Injectable } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { v4 } from 'uuid';
import {
  UserAlreadyInGameException,
  GameNotFoundException,
  PlayerNotFoundException,
} from './exceptions/';
import { Player } from './entities/player.entity';
import { Physic } from './entities/gamePhysics.entity';

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
    BARFILL: 'yellow',
    BARBORDER: 'yellow',
    BALLRADIUS: 10,
    BALLFILL: 'yellow',
    BALLBORDER: 'yellow',
    BGFILL: 'black',
    WALLSIZE: 10,
  });

  games: Game[];

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
      this._startGame(server, games, len - 1);
  }

  /** Init game physics from grid */
  private _initGamePhysics(game: Game): Game {
    // Players
    game.players.forEach((player) => {
      const pY = this.params.CANVASW / 2;
      const pX =
        player.side === Side.RIGHT
          ? this.params.CANVASH - this.params.BARWIDTH - 50
          : 50;
      game.gamePhysics.players.push({
        coordinates: { x: pX, y: pY },
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
        coordinates: { x: this.params.CANVASW / 2, y: 0 },
        dimensions: { h: this.params.WALLSIZE, w: this.params.CANVASW },
        side: Wall.TOP,
        type: PhyType.RECT,
      },
      {
        coordinates: { x: this.params.CANVASW / 2, y: this.params.CANVASH },
        dimensions: { h: this.params.WALLSIZE, w: this.params.CANVASW },
        side: Wall.BOTTOM,
        type: PhyType.RECT,
      },
    ].forEach((wall) => game.gamePhysics.walls.push(wall));
    // Goals
    [
      {
        coordinates: { x: 0, y: this.params.CANVASH / 2 },
        dimensions: { h: this.params.CANVASH, w: this.params.WALLSIZE },
        side: Side.LEFT,
        type: PhyType.RECT,
      },
      {
        coordinates: { x: this.params.CANVASW, y: this.params.CANVASH / 2 },
        dimensions: { h: this.params.CANVASH, w: this.params.WALLSIZE },
        side: Side.RIGHT,
        type: PhyType.RECT,
      },
    ].forEach((goal) => game.gamePhysics.goals.push(goal));
    // Ball
    game.gamePhysics.ball.coordinates = game.gameGrid.ball;
    game.gamePhysics.ball.dimensions = { r: this.params.BALLRADIUS };
    // Ball initial direction and speed
    game.gamePhysics.ball.direction = { x: Math.random(), y: Math.random() };
    game.gamePhysics.ball.speed = this.params.BALLSPEED;
    return game;
  }

  /** Init game grid */
  private _initGameGrid(game: Game): Game {
    // Players
    game.players.forEach((player) => {
      game.gameGrid.players.push({
        coordinates: { x: 0, y: 0 },
        side: player.side,
      });
    });
    // Ball
    game.gameGrid.ball = { x: 0, y: 0 };
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
    game.gamePhysics.ball.coordinates = game.gameGrid.ball;
    return game;
  }

  /** Get the side of a player in a game from his id */
  private _getSideFromUser(game: Game, userId: number): number {
    const player: Player = game.players.find(
      (player) => player.userId === userId,
    );
    if (!player) throw new PlayerNotFoundException(userId);
    return player.side;
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
  private _bounce(object: Physic): Physic {
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
      updatedObject = {
        ...object,
        direction: {
          // A calculer
          x: 0,
          y: object.direction.y * -1,
        },
      };
    }
    return updatedObject;
  }

  /** Update the physics from player's move */
  private _updatePhysicsFromMove(
    game: Game,
    userId: number,
    move: number,
  ): Game {
    // get proper paddle
    const side: number = this._getSideFromUser(game, userId);
    const playerIndex = game.gamePhysics.players.findIndex(
      (player) => player.side === side,
    );
    let paddle: Physic = game.gamePhysics.players[playerIndex];
    // calculate the Y step
    const step: number =
      move === Move.UP ? this.params.PLAYERSPEED * -1 : this.params.PLAYERSPEED;
    // create a object with updated coordinates to check possible collision
    const futurePaddle = {
      ...paddle,
      coordinates: { x: paddle.coordinates.x, y: paddle.coordinates.y + step },
      direction:
        move === Move.UP
          ? { x: 0, y: this.params.PLAYERSPEED * -1 }
          : { x: 0, y: this.params.PLAYERSPEED },
      speed: this.params.PLAYERSPEED,
    };
    // if collision
    if (
      this._isCollision(futurePaddle, game.gamePhysics.walls[Wall.TOP]) ||
      this._isCollision(futurePaddle, game.gamePhysics.walls[Wall.BOTTOM])
    )
      paddle = this._bounce(paddle);
    else paddle = futurePaddle;
    game.gamePhysics.players[playerIndex] = paddle;
    return game;
  }

  /** Move the ball and players according to directions and speed */
  private _movePhysicsForward(game: Game): Game {
    // Players inertia
    const players: Physic[] = game.gamePhysics.players.map((player) => ({
      ...player,
      coordinates: {
        x: player.coordinates.x,
        y: player.coordinates.y + player.speed * player.direction.y,
      },
      speed: player.speed - 0.1 > 0 ? player.speed - 0.1 : 0,
    }));
    game.gamePhysics.players = players;
    // Ball
    game.gamePhysics.ball.coordinates.x +=
      game.gamePhysics.ball.speed * game.gamePhysics.ball.direction.x;
    game.gamePhysics.ball.coordinates.y +=
      game.gamePhysics.ball.speed * game.gamePhysics.ball.direction.y;
    return game;
  }

  /** Start a game */
  private _startGame(server: Server, games: Game[], index: number) {
    games[index] = this._initGamePhysics(games[index]);
    games[index] = this._initGameGrid(games[index]);
    games[index].status = Status.STARTED;
    const gameInterval = setInterval(() => {
      // move the objects according to their vectors and current speed, with collition detection
      games[index] = this._movePhysicsForward(games[index]);
      // update the grid with new positions
      games[index] = this._updateGridFromPhysics(games[index]);
      server.to(games[index].roomId).emit('updateGrid', games[index].gameGrid);
    }, 1000);
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
      games[index] = this._updatePhysicsFromMove(
        games[index],
        userId,
        updateGameDto.move,
      );
    }
  }

  /** join a game (player) */
  join(client: Socket, server: Server, id: string, games: Game[]) {
    const index = games.findIndex((game) => game.roomId === id);
    if (index === -1) throw new GameNotFoundException(id);
    // add new player to the game and emit new grid
    games[index] = this._addPlayerToGame(client, Side.RIGHT, games, index);
    // Check if the game has 2 players
    if (games[index].players.length >= 2) {
      this._startGame(server, games, index);
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

  /** get game grid and param on request */
  getGameGrid(client: Socket, id: string, games: Game[]) {
    const index = games.findIndex((game) => game.roomId === id);
    if (index === -1) throw new GameNotFoundException(id);
    client.emit('updateGrid', games[index].gameGrid);
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
}
