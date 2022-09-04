import { OnModuleInit } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as Matter from 'matter-js';

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
    this.radius = 10;
  }
  x: number;
  y: number;
  radius: number;
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
  private matterGame = {
    matterEngine: undefined,
    bodies: undefined,
    composite: undefined,
    engine: undefined,
    leftPlayer: undefined,
    rightPlayer: undefined,
    ball: undefined,
  };
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    console.log('Websocket server is up...');
  }
  private _gameInit() {
    // create an engine
    this.matterGame.matterEngine = Matter.Engine;
    this.matterGame.bodies = Matter.Bodies;
    this.matterGame.composite = Matter.Composite;
    this.matterGame.engine = this.matterGame.matterEngine.create();
    this.matterGame.engine.world.gravity.y = 0;
    this.matterGame.leftPlayer = this.matterGame.bodies.rectangle(
      50,
      275,
      10,
      50,
    );
    this.matterGame.rightPlayer = this.matterGame.bodies.rectangle(
      550,
      275,
      10,
      50,
    );
    this.matterGame.ball = this.matterGame.bodies.circle(300, 300, 10);
    this.matterGame.ball.restitution = 0.8;
    console.log(`After game init ${this.matterGame.ball.position.x}`);
    // create two boxes and a ground
    const leftWall = this.matterGame.bodies.rectangle(0, 300, 10, 600, {
      isStatic: true,
    });
    const rightWall = this.matterGame.bodies.rectangle(590, 300, 10, 600, {
      isStatic: true,
    });
    const topWall = this.matterGame.bodies.rectangle(300, 0, 600, 10, {
      isStatic: true,
    });
    const bottomWall = this.matterGame.bodies.rectangle(300, 590, 600, 10, {
      isStatic: true,
    });

    Matter.Body.applyForce(
      this.matterGame.ball,
      this.matterGame.ball.position,
      { x: 0.05, y: 0.0 },
    );
    // add all of the bodies to the world
    this.matterGame.composite.add(this.matterGame.engine.world, [
      this.matterGame.leftPlayer,
      this.matterGame.rightPlayer,
      leftWall,
      rightWall,
      topWall,
      bottomWall,
      this.matterGame.ball,
    ]);
  }

  handleConnection(client: Socket, payload: any) {
    const userId = client.handshake.query.userId;
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
    if (this.game.players[0] && this.game.players[1]) {
      this._gameInit();
      const gameInterval = setInterval(() => {
        console.log(`Inside Set Interval ${this.matterGame.ball.position.x}`);
        Matter.Engine.update(this.matterGame.engine);
        // while (true);
        this._updateGameVariables();
        this.server.emit('updateGame', this.game);
        // console.log(`Interval ${this.matterGame.ball.radius}`);
      }, 100);
      // clearInterval(gameInterval);
    }
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

  private _physicsEngine(client: Player, move: number): Player {
    const yLimitUp = this.moveSpeed;
    const yLimitDown = 600 - this.moveSpeed - this.barHeight;
    if (move === Movement.UP && client.y >= yLimitUp) {
      client.y -= this.moveSpeed;
    }
    if (move === Movement.DOWN && client.y <= yLimitDown)
      client.y += this.moveSpeed;
    if (client.position === PlayerPosition.LEFT)
      Matter.Body.setPosition(this.matterGame.leftPlayer, {
        x: client.x,
        y: client.y,
      });
    else
      Matter.Body.setPosition(this.matterGame.rightPlayer, {
        x: client.x,
        y: client.y,
      });
    return client;
  }
  private _updateGameVariables() {
    if (this.game.players[PlayerPosition.LEFT]) {
      this.game.players[PlayerPosition.LEFT].x =
        this.matterGame.leftPlayer.position.x;
      this.game.players[PlayerPosition.LEFT].y =
        this.matterGame.leftPlayer.position.y;
    }
    if (this.game.players[PlayerPosition.RIGHT]) {
      this.game.players[PlayerPosition.RIGHT].x =
        this.matterGame.rightPlayer.position.x;
      this.game.players[PlayerPosition.RIGHT].y =
        this.matterGame.rightPlayer.position.y;
    }
    this.game.ball.x = this.matterGame.ball.position.x;
    this.game.ball.y = this.matterGame.ball.position.y;
    // this.game.ball.radius = this.matterGame.ball.radius;
  }
}
