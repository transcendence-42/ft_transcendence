import { Injectable } from '@nestjs/common';
import { WebSocketServer, WsException } from '@nestjs/websockets';
import { Bodies, Body, Composite, Engine } from 'matter-js';
import { Socket, Server } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { GamePhysics } from './entities/gamePhysics.entity';

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
    this.serverData = [];
  }

  @WebSocketServer()
  server: Server;

  serverData: Game[];

  /** client connection */
  clientConnection(client: Socket, server: Server, serverData: Game[]) {
    // get query information
    const userId = client.handshake.query.userId;
    console.log(`user number : ${userId} (${client.id}) connected !`);
    // if the user id is in a game, reconnect the client to the game
    const game = serverData.find(
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
  clientDisconnection(client: Socket, server: Server, serverData: Game[]) {
    const userId = client.handshake.query.userId;
    console.log(`user : ${userId} (${client.id}) disconnected`);
    // Broadcast that user left the lobby
    server.to('lobby').emit('info', {
      message: `user ${userId} (${client.id}) left the lobby`,
    });
    // Warn the room if the player is in game
    const maybeGame = serverData.findIndex(
      (game) =>
        game.players.filter((player) => player.userId === +userId).length === 1,
    );
    if (maybeGame !== -1)
      server.to(serverData[maybeGame].roomId).emit('playerLeft', {
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
      game.gameParams.canvasW / 2,
      0,
      game.gameParams.canvasH,
      game.gameParams.wallSize,
      { isStatic: true },
    );
    game.gamePhysics.walls[walls.RIGHT] = Bodies.rectangle(
      game.gameParams.canvasW - game.gameParams.wallSize,
      game.gameParams.canvasH / 2,
      game.gameParams.wallSize,
      game.gameParams.canvasH,
      { isStatic: true },
    );
    game.gamePhysics.walls[walls.BOTTOM] = Bodies.rectangle(
      game.gameParams.canvasW / 2,
      game.gameParams.canvasH - game.gameParams.wallSize,
      game.gameParams.canvasW,
      game.gameParams.wallSize,
      { isStatic: true },
    );
    game.gamePhysics.walls[walls.LEFT] = Bodies.rectangle(
      0,
      game.gameParams.canvasH / 2,
      game.gameParams.wallSize,
      game.gameParams.canvasW,
      { isStatic: true },
    );
    // Ball
    game.gamePhysics.ball = Bodies.circle(
      game.gameParams.canvasW / 2,
      game.gameParams.canvasH / 2,
      game.gameParams.ballRadius,
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
        game.gameParams.barWidth,
        game.gameParams.barHeight,
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
    serverData: Game[],
    index: number,
  ) {
    const userId: number = +player.handshake.query.userId;
    // in Game
    player.leave('lobby');
    player.join(serverData[index].roomId);
    serverData[index].players.push({
      socketId: player.id,
      userId: userId,
    });
    // in Grid
    const pX =
      side === Side.LEFT ? 50 : serverData[index].gameParams.canvasW - 50;
    const pY = serverData[index].gameParams.canvasH / 2;
    serverData[index].gameGrid.playersCoordinates.push({
      playerId: player.id,
      playerSide: side,
      coordinates: { x: pX, y: pY },
    });
  }

  /** Check if a player is already in a game */
  private _isPlayerInGame(userId: number, serverData: Game[]): boolean {
    if (
      serverData.find((game) =>
        game.players.find((player) => player.userId === userId),
      )
    )
      return true;
    return false;
  }

  /** Create a new game in dedicated room with 1 player */
  create(players: Socket[], server: Server, serverData: Game[]) {
    // create a new game
    const newGame: Game = new Game(players[0].id);
    const len = serverData.push(newGame);
    // add players to the game and emit initial grid
    players.forEach((player, index) => {
      const userId: number = +player.handshake.query.id;
      if (this._isPlayerInGame(userId, serverData)) {
        throw new WsException(
          `User : ${userId} is already registerd in a game`,
        );
      }
      const side = index ? Side.RIGHT : Side.LEFT;
      this._addPlayerToGame(player, side, serverData, len - 1);
      player.emit('newGameId', { id: serverData[len - 1].roomId });
    });
    // Broadcast new gamelist to the lobbs
    const games = this._createGameList(serverData);
    server.to('lobby').emit('gameList', games);
    // start game if players > 1
    if (serverData[len - 1].players.length > 1)
      this._startGame(server, serverData, len - 1);
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
  private _startGame(server: Server, serverData: Game[], index: number) {
    serverData[index] = this._initPhysics(serverData[index]);
    console.log('ok');
    const gameInterval = setInterval(() => {
      Engine.update(serverData[index].gamePhysics.engine);
      this._updateGridCoordinates(serverData[index]);
      server
        .to(serverData[index].roomId)
        .emit('updateGrid', serverData[index].gameGrid);
    }, 100);
    //clearInterval(gameInterval);
  }

  /** update a game (moves) */
  update(
    client: Socket,
    server: Server,
    id: string,
    updateGameDto: UpdateGameDto,
    serverData: Game[],
  ) {
    const index = serverData.findIndex((game) => game.roomId === id);
    if (index === -1) {
      console.log('Error : wrong game id');
      return;
    }
    // Update user coordinates (let the physic engine blocks the players)
    const move: number =
      updateGameDto.move === Move.UP
        ? serverData[index].gameParams.moveSpeed * -1
        : serverData[index].gameParams.moveSpeed;
    serverData[index].gameGrid.playersCoordinates = serverData[
      index
    ].gameGrid.playersCoordinates.map((player) => {
      if (player.playerId === client.id) {
        console.log(player.coordinates.y + move);
        return {
          coordinates: {
            x: player.coordinates.x,
            y: player.coordinates.y + move,
          },
          playerId: player.playerId,
          playerSide: player.playerSide,
        };
      } else return player;
    });
    server
      .to(serverData[index].roomId)
      .emit('updateGrid', serverData[index].gameGrid);
  }

  /** join a game (player) */
  join(client: Socket, server: Server, id: string, serverData: Game[]) {
    const index = serverData.findIndex((game) => game.roomId === id);
    if (index === -1) {
      console.log('Error : wrong game id');
      return;
    }
    // add new player to the game and emit new grid
    this._addPlayerToGame(client, Side.RIGHT, serverData, index);
    // Check if the game has 2 players
    if (serverData[index].players.length >= 2) {
      this._startGame(server, serverData, index);
    }
    // update the image with the new player for everyone
    server
      .to(serverData[index].roomId)
      .emit('updateGrid', serverData[index].gameGrid);
  }

  /** view a game (viewer) */
  view(client: Socket, id: string, serverData: Game[]) {
    const index = serverData.findIndex((game) => game.roomId === id);
    if (index === -1) {
      console.log('Error : wrong game id');
      return;
    }
    client.join(serverData[index].roomId);
    // add new viewer to the game and push him a grid update
    const userId: number = +client.handshake.query.userId;
    serverData[index].viewers.push({ userId: userId, socketId: client.id });
  }

  /** reconnect a game (existing player) */
  reconnect(client: Socket, id: string, serverData: Game[]) {
    const userId: number = +client.handshake.query.userId;
    const index = serverData.findIndex((game) => game.roomId === id);
    if (index === -1) {
      console.log('Error : wrong game id');
      return;
    }
    // get old socket id
    const oldSocketId = serverData[index].players.find(
      (player) => player.userId === userId,
    ).socketId;
    // update player socket on player list
    serverData[index].players = serverData[index].players.map((player) =>
      player.userId === userId ? { socketId: client.id, ...player } : player,
    );
    // update player socket on grid
    serverData[index].gameGrid.playersCoordinates = serverData[
      index
    ].gameGrid.playersCoordinates.map((player) =>
      player.playerId === oldSocketId
        ? { playerId: client.id, ...player }
        : player,
    );
  }

  /** Create the game list from the global server data */
  private _createGameList(serverData: Game[]): object {
    const games = serverData.map((game) => {
      return {
        roomId: game.roomId,
        players: game.players,
        viewers: game.viewers,
      };
    });
    return games;
  }

  /** get game grid and param on request */
  getGameInfo(client: Socket, id: string, serverData: Game[]) {
    const index = serverData.findIndex((game) => game.roomId === id);
    if (index === -1) {
      console.log('Error : wrong game id');
      return;
    }
    // add new viewer to the game and push him a grid update
    client.emit('updateGrid', serverData[index].gameGrid);
    client.emit('gameParams', serverData[index].gameParams);
  }

  /** Find all created games */
  findAll(client: Socket, serverData: Game[]) {
    const games = this._createGameList(serverData);
    client.emit('gameList', games);
  }

  /** one client intentionnaly leave the game (abandon) */
  leaveGame(client: Socket, server: Server, id: string, serverData: Game[]) {
    serverData = serverData.filter((game) => game.roomId !== id);
    // use prisma to update users and match info
  }
}
