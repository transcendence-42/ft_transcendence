import { Injectable } from '@nestjs/common';
import { Bodies, Body, Composite, Engine } from 'matter-js';
import { Socket, Server } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { GamePhysics } from './entities/gamePhysics.entity';
import { v4 } from 'uuid';
import {
  UserAlreadyInGameException,
  GameNotFoundException,
} from './exceptions/';

// Enums
enum Side {
  LEFT = 0,
  RIGHT,
}

enum Move {
  UP = 0,
  DOWN,
}

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {
    this.games = [];
  }

  readonly params = Object.freeze({
    CANVASW: 600,
    CANVASH: 600,
    MOVESPEED: 5,
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
      client.join('lobby');
      server.to('lobby').emit('info', {
        message: `user ${userId} (${client.id}) joined the lobby`,
      });
    }
  }

  /** client disconnection */
  clientDisconnection(client: Socket, server: Server, games: Game[]) {
    const userId = client.handshake.query.userId;
    console.log(`user : ${userId} (${client.id}) disconnected`);
    // Broadcast that user left the lobby
    server.to('lobby').emit('info', {
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

  /** Init game physics */
  private _initPhysics(game: Game): Game {
    enum walls {
      TOP = 0,
      RIGHT,
      BOTTOM,
      LEFT,
    }
    enum players {
      LEFT = 0,
      RIGHT,
    }
    // Init physics
    game.gamePhysics = new GamePhysics();
    // Walls
    game.gamePhysics.walls[walls.TOP] = Bodies.rectangle(
      this.params.CANVASW / 2,
      0,
      this.params.CANVASW,
      this.params.WALLSIZE,
      { isStatic: true },
    );
    game.gamePhysics.walls[walls.RIGHT] = Bodies.rectangle(
      this.params.CANVASW - this.params.WALLSIZE,
      this.params.CANVASW / 2,
      this.params.WALLSIZE,
      this.params.CANVASW,
      { isStatic: true },
    );
    game.gamePhysics.walls[walls.BOTTOM] = Bodies.rectangle(
      this.params.CANVASW / 2,
      this.params.CANVASW - this.params.WALLSIZE,
      this.params.CANVASW,
      this.params.WALLSIZE,
      { isStatic: true },
    );
    game.gamePhysics.walls[walls.LEFT] = Bodies.rectangle(
      0,
      this.params.CANVASW / 2,
      this.params.WALLSIZE,
      this.params.CANVASW,
      { isStatic: true },
    );
    // Ball
    game.gamePhysics.ball = Bodies.circle(
      this.params.CANVASW / 2,
      this.params.CANVASW / 2,
      this.params.BALLRADIUS,
    );
    Body.applyForce(game.gamePhysics.ball, game.gamePhysics.ball.position, {
      x: 0.05,
      y: 0.0,
    });
    // Left Player
    game.gameGrid.playersCoordinates.forEach((player) => {
      game.gamePhysics.players[player.playerSide] = Bodies.rectangle(
        game.gameGrid.playersCoordinates[player.playerSide].coordinates.x,
        game.gameGrid.playersCoordinates[player.playerSide].coordinates.y,
        this.params.BARWIDTH,
        this.params.BARHEIGHT,
      );
    });
    // Add all bodies to the world
    game.gamePhysics.engine = Engine.create();
    game.gamePhysics.engine.gravity.y = 0;
    game.gamePhysics.composite = Composite.add(game.gamePhysics.engine.world, [
      game.gamePhysics.players[players.LEFT],
      game.gamePhysics.players[players.RIGHT],
      game.gamePhysics.walls[walls.TOP],
      game.gamePhysics.walls[walls.RIGHT],
      game.gamePhysics.walls[walls.BOTTOM],
      game.gamePhysics.walls[walls.LEFT],
      game.gamePhysics.ball,
    ]);
    return game;
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
    player.leave('lobby');
    player.join(game.roomId);
    game.players.push({
      socketId: player.id,
      userId: userId,
    });
    // in Grid
    const pX = side === Side.LEFT ? 50 : this.params.CANVASW - 50;
    const pY = this.params.CANVASW / 2;
    game.gameGrid.playersCoordinates.push({
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
    server.to('lobby').emit('gameList', gameList);
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
    game.gameGrid.playersCoordinates.forEach((player) => {
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

  /** start a game */
  private _startGame(server: Server, games: Game[], index: number) {
    games[index] = this._initPhysics(games[index]);
    console.log('ok');
    const gameInterval = setInterval(() => {
      Engine.update(games[index].gamePhysics.engine);
      this._updateGridCoordinates(games[index]);
      server.to(games[index].roomId).emit('updateGrid', games[index].gameGrid);
    }, 100);
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
    if (index === -1) {
      console.log('Error : wrong game id');
      return;
    }
    // Update user coordinates (let the physic engine blocks the players)
    const i = games[index].gameGrid.playersCoordinates.findIndex(
      (player) => player.playerId === client.id,
    );
    const maxUp = this.params.WALLSIZE + this.params.MOVESPEED;
    const maxDown =
      this.params.CANVASH -
      this.params.MOVESPEED -
      this.params.WALLSIZE -
      this.params.BARHEIGHT;
    if (updateGameDto.move === Move.UP) {
      const currentY =
        games[index].gameGrid.playersCoordinates[i].coordinates.y;
      if (currentY >= maxUp)
        games[index].gameGrid.playersCoordinates[i].coordinates.y -=
          this.params.MOVESPEED;
    }
    if (updateGameDto.move === Move.DOWN) {
      const currentY =
        games[index].gameGrid.playersCoordinates[i].coordinates.y;
      if (currentY <= maxDown)
        games[index].gameGrid.playersCoordinates[i].coordinates.y +=
          this.params.MOVESPEED;
    }
    // if physics engine is up
    if (games[index].gamePhysics) {
      games[index].gameGrid.playersCoordinates.forEach((player) => {
        Body.setPosition(games[index].gamePhysics.players[player.playerSide], {
          x: player.coordinates.x,
          y: player.coordinates.y,
        });
      });
    }
    server.to(games[index].roomId).emit('updateGrid', games[index].gameGrid);
  }

  /** join a game (player) */
  join(client: Socket, server: Server, id: string, games: Game[]) {
    const index = games.findIndex((game) => game.roomId === id);
    if (index === -1) {
      console.log('Error : wrong game id');
      return;
    }
    // add new player to the game and emit new grid
    games[index] = this._addPlayerToGame(client, Side.RIGHT, games, index);
    // Check if the game has 2 players
    if (games[index].players.length >= 2) {
      this._startGame(server, games, index);
    }
    // update the image with the new player for everyone
    server.to(games[index].roomId).emit('updateGrid', games[index].gameGrid);
  }

  /** view a game (viewer) */
  view(client: Socket, id: string, games: Game[]) {
    const index = games.findIndex((game) => game.roomId === id);
    if (index === -1) {
      console.log('Error : wrong game id');
      return;
    }
    client.join(games[index].roomId);
    // add new viewer to the game and push him a grid update
    const userId: number = +client.handshake.query.userId;
    games[index].viewers.push({ userId: userId, socketId: client.id });
  }

  /** reconnect a game (existing player) */
  reconnect(client: Socket, id: string, games: Game[]) {
    const userId: number = +client.handshake.query.userId;
    const index = games.findIndex((game) => game.roomId === id);
    if (index === -1) {
      console.log('Error : wrong game id');
      return;
    }
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
        viewers: game.viewers,
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
