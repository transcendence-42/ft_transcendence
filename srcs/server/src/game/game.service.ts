import { Injectable } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'http';
import { Bodies, Composite } from 'matter-js';
import { Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { UpdateGameDto } from './dto/update-game.dto';
import { Client } from './entities/client.entity';
import { Game } from './entities/game.entity';

@Injectable()
export class GameService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {
    this.clientList = [];
    this.serverData = [];
  }

  @WebSocketServer()
  server: Server;

  clientList: Client[];
  serverData: Game[];

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
    // Walls
    game.gamePhysics.walls[walls.TOP] = Bodies.rectangle(
      game.gameParams.canvasW / 2,
      0,
      game.gameParams.canvasH,
      10,
      { isStatic: true },
    );
    game.gamePhysics.walls[walls.RIGHT] = Bodies.rectangle(
      game.gameParams.canvasW - 10,
      game.gameParams.canvasH / 2,
      10,
      game.gameParams.canvasH,
      { isStatic: true },
    );
    game.gamePhysics.walls[walls.BOTTOM] = Bodies.rectangle(
      game.gameParams.canvasW / 2,
      game.gameParams.canvasH - 10,
      game.gameParams.canvasW,
      10,
      { isStatic: true },
    );
    game.gamePhysics.walls[walls.LEFT] = Bodies.rectangle(
      0,
      game.gameParams.canvasH / 2,
      10,
      game.gameParams.canvasW,
      { isStatic: true },
    );
    // Ball
    game.gamePhysics.ball = Bodies.circle(
      game.gameParams.canvasW / 2,
      game.gameParams.canvasH / 2,
      game.gameParams.ballRadius,
    );
    // Left Player
    game.gamePhysics.players[players.LEFT] = Bodies.rectangle(
      game.gameCanvas.playersPosition[players.LEFT].x,
      game.gameCanvas.playersPosition[players.LEFT].y,
      game.gameParams.barWidth,
      game.gameParams.barHeight,
    );
    // Add all bodies to the world
    game.gamePhysics.composite = Composite.add(game.gamePhysics.engine.world, [
      game.gamePhysics.players[players.LEFT],
      game.gamePhysics.walls[walls.TOP],
      game.gamePhysics.walls[walls.RIGHT],
      game.gamePhysics.walls[walls.BOTTOM],
      game.gamePhysics.walls[walls.LEFT],
      game.gamePhysics.ball,
    ]);
    return game;
  }

  /** Create a new game in dedicated room with 2 players */
  create(client: Socket, serverData: Game[]) {
    // get user from client
    const userId = client.handshake.query.userId;
    // create a new room for this client
    client.leave('lobby');
    client.join('user' + userId + 'game');
    // create a new game in the game array
    const len = serverData.push({
      roomId: 'user' + userId + 'game',
      players: [
        {
          socketId: client.id,
          userId: +userId,
        },
      ],
    });
    // apply params to the game physics
    serverData[len - 1] = this._initPhysics(serverData[len - 1]);
    // emit game initial canvas to client
    client.emit('init', serverData[len - 1].gameCanvas);
    // Broadcast new gamelist to the lobby
    const games = this._createGameList(serverData);
    this.server.emit('lobby', games);
  }

  /** Find all created games */
  findAll(client: Socket, serverData: Game[]) {
    const games = this._createGameList(serverData);
    client.emit('gameList', games);
  }

  /** start a game */
  private _launchGame() {
    // set interval
      // Apply initial force to the ball
      // Update Canvas through physics
      // broadcast canvas to the room
  }

  /** update a game (infos, status, players, viewers, ...) */
  update(id: string, updateGameDto: UpdateGameDto, serverData: Game[]) {
    // New player
    if (updateGameDto.player) {
      // Add new player to the game
      const index = serverData.findIndex((game) => game.roomId === id);
      serverData[index].players.push({
        socketId: updateGameDto.player.socketId,
      });
      // Update game Canvas and Physics with new player
      serverData[index].gameCanvas.playersPosition.push({});
      // Check if the game has 2 players
      if (serverData[index].players.length >= 2)
        this._launchGame();
    }
    // Move
      // Calculate updated positions
      // Update canvas throught physics
      // broadcast canvas to the room
  }

  /** remove a game */
  remove(id: string, serverData: Game[]) {
    serverData = serverData.filter((game) => game.roomId !== id);
  }
}
