import { Injectable } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { v4 } from 'uuid';
import {
  UserAlreadyInGameException,
  GameNotFoundException,
} from './exceptions/';

// Enums
enum Move {
  UP = 0,
  DOWN,
}

enum Side {
  TOP = 0,
  RIGHT,
  BOTTOM,
  LEFT,
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
    MOVESPEED: 10,
    BARWIDTH: 10,
    BARHEIGHT: 50,
    BARFILL: 'yellow',
    BARBORDER: 'yellow',
    BALLRADIUS: 10,
    BALLFILL: 'yellow',
    BALLBORDER: 'yellow',
    BGFILL: 'black',
    WALLSIZE: 10,
    BALLSPEED: 5,
  });

  games: Game[];

  /** client connection */
  clientConnection(client: Socket, server: Server, games: Game[]) {
    // get query information
    const userId = client.handshake.query.userId;
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
    const userId = client.handshake.query.userId;
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

  /** Add player to a game */
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
    // in Game
    player.leave(this.LOBBY);
    player.join(game.roomId);
    game.players.push({
      socketId: player.id,
      userId: userId,
    });
    // in Grid
    const pX = side === Side.LEFT ? 50 : this.params.CANVASW - 50;
    const pY = this.params.CANVASW / 2;
    game.gameGrid.players.push({
      playerId: player.id,
      playerSide: side,
      coordinates: { x: pX, y: pY },
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

  /** Check if a viewe is already in a game */
  private _isViewerInGame(userId: number, games: Game[]): boolean {
    if (
      games.find((game) =>
        game.viewers.find((viewer) => viewer.userId === userId),
      )
    )
      return true;
    return false;
  }

  /** Create a new game in dedicated room with 1 player */
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

  /** update grid coordinates from physic engine */
  private _updateGridCoordinates(game: Game) {
    // ball
    game.gameGrid.ball.x = game.gamePhysics.ball.position.x;
    game.gameGrid.ball.y = game.gamePhysics.ball.position.y;
    // players
    game.gameGrid.players.forEach((player) => {
      if (player.playerSide === Side.LEFT) {
        player.coordinates.x = game.gamePhysics.players[Side.LEFT].position.x;
        player.coordinates.y = game.gamePhysics.players[Side.LEFT].position.y;
      }
      if (player.playerSide === Side.RIGHT) {
        player.coordinates.x = game.gamePhysics.players[Side.RIGHT].position.x;
        player.coordinates.y = game.gamePhysics.players[Side.RIGHT].position.y;
      }
    });
  }

  /** Init game physics */
  private _initGamePhysics(game: Game): Game {
    // Players
    game.gameGrid.players.forEach((player) => {
      game.gamePhysics.players.push({
        coordinates: player.coordinates,
        dimensions: { h: this.params.BARHEIGHT, w: this.params.BARWIDTH },
        direction: { x: 0, y: 0 },
        speed: 0,
        side: player.playerSide,
      });
    });
    // Walls
    [
      {
        coordinates: { x: this.params.CANVASW / 2, y: 0 },
        dimensions: { h: this.params.WALLSIZE, w: this.params.CANVASW },
        side: Side.TOP,
      },
      {
        coordinates: { x: this.params.CANVASW / 2, y: this.params.CANVASH },
        dimensions: { h: this.params.WALLSIZE, w: this.params.CANVASW },
        side: Side.BOTTOM,
      },
    ].forEach((wall) => game.gamePhysics.walls.push(wall));
    // Goals
    [
      {
        coordinates: { x: 0, y: this.params.CANVASH / 2 },
        dimensions: { h: this.params.CANVASH, w: this.params.WALLSIZE },
        side: Side.LEFT,
      },
      {
        coordinates: { x: this.params.CANVASW, y: this.params.CANVASH / 2 },
        dimensions: { h: this.params.CANVASH, w: this.params.WALLSIZE },
        side: Side.RIGHT,
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

  /** Start a game */
  private _startGame(server: Server, games: Game[], index: number) {
    const gameInterval = setInterval(() => {
      // Initialise game physics
      games[index] = this._initGamePhysics(games[index]);
      // move the objects according to their vectors and current speed
      // update the grid with new ball position
      this._updateGridCoordinates(games[index]);
      server.to(games[index].roomId).emit('updateGrid', games[index].gameGrid);
    }, 50);
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
    // Update players positions

    // Broadcast updated grid to all players/ viewers in the game
    server.to(games[index].roomId).emit('updateGrid', games[index].gameGrid);
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
    // get old socket id
    const oldSocketId = games[index].players.find(
      (player) => player.userId === userId,
    ).socketId;
    // update player socket on player list
    games[index].players = games[index].players.map((player) =>
      player.userId === userId ? { socketId: client.id, ...player } : player,
    );
    // update player socket on grid
    games[index].gameGrid.playersCoordinates = games[
      index
    ].gameGrid.playersCoordinates.map((player) =>
      player.playerId === oldSocketId
        ? { playerId: client.id, ...player }
        : player,
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
