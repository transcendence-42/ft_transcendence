import { OnModuleInit } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

class Game {
  constructor() {
    this.players = [];
    this.ball = new Ball();
  }
  players: Player[];
  ball: Ball;
}

class Player {
  constructor(readonly position: PlayerPosition, readonly socketId: string) {
    if (position === PlayerPosition.LEFT) {
      this.x = 550;
    } else this.x = 50;
    this.y = 275;
  }
  x: number;
  y: number;
  positon: PlayerPosition;
}

class Ball {
  constructor() {
    this.x = 300;
    this.y = 300;
  }
  x: number;
  y: number;
  direction;
  speed: number;
}

enum Movement {
  UP = 0,
  DOWN,
}

enum PlayerPosition {
  LEFT = 0,
  RIGHT,
}

@WebSocketGateway(4343, { cors: true })
export class GameGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  private numClient = 0;
  private game: Game = new Game();
  private readonly moveSpeed: number = 5;
  private readonly canvaX = 600;
  private readonly canvaY = 600;
  private readonly barHeight = 50;

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    console.log('Websocket server is up...');
  }

  handleConnection(client: Socket, payload: any) {
    console.log(`client number : ${client.id} connected to the server`);
    // add player to the players array in the Game
    if (!this.game.players[PlayerPosition.LEFT])
      this.game.players[PlayerPosition.LEFT] = new Player(
        PlayerPosition.LEFT,
        client.id,
      );
    else
      (this.game.players[PlayerPosition.RIGHT] = new Player(
        PlayerPosition.RIGHT,
        client.id,
      )),
        this.server.emit('broadcast', {
          message: `${client.id} joined the server`,
          game: this.game,
        });
    if (this.game.players[0] && this.game.players[1])
      setInterval(() => {
        this.server.emit('updateGame', this.game);
      }, 1000 / 60);
  }

  handleDisconnect(client: Socket) {
    console.log(`client ${client.id} disconnected`);
    this.game.players = this.game.players.map((player) => {
      if (player && player.socketId === client.id) return null;
      else return player;
    });
    this.server.emit('broadcast', {
      message: `${client.id} left the server`,
      game: this.game,
    });
  }

  @SubscribeMessage('move')
  handleMove(client: Socket, payload: { move: number }) {
    this.game.players = this.game.players.map((player) => {
      if (player && player.socketId === client.id) {
        console.log(`Moving client ${JSON.stringify(player, null, 4)}`);
        return this._physicsEngine(player, payload.move);
      } else return player;
    });
  }

  private _updateGame(server, game) {
    server.emit('updateGame', this.game);
  }

  private _ballPhysics(clients: Player[]) {
    // apply physics.js
    //
  }

  private _physicsEngine(client: Player, move: number): Player {
    const yLimitUp = this.moveSpeed;
    const yLimitDown = 600 - this.moveSpeed - this.barHeight;
    if (move === Movement.UP && client.y >= yLimitUp)
      client.y -= this.moveSpeed;
    if (move === Movement.DOWN && client.y <= yLimitDown)
      client.y += this.moveSpeed;
    return client;
  }
}
