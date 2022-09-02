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
  /*
Matter.Bodies.rectangle(x, y, width, height, [options]) → Body
Creates a new rigid body model with a rectangle hull. The options parameter is 
an object that specifies any properties you wish to override the defaults. 
See the properties section of the Matter.Body module for detailed information 
on what you can pass via the options object.

Parameters
x Number
y Number
width Number
height Number
[options] Object optional
Returns
Body A new rectangle body
*/
  onModuleInit() {
    console.log('Websocket server is up...');
  }

  private _gameInit() {
    const matterEngine = Matter.Engine;
    const bodies = Matter.Bodies;
    const composite = Matter.Composite;

    // create an engine
    const engine = matterEngine.create();

    // create two boxes and a ground
    this.game.players[PlayerPosition.LEFT] = bodies.rectangle(50, 275, 10, 50);
    this.game.players[PlayerPosition.RIGHT] = bodies.rectangle(
      550,
      275,
      10,
      50,
    );
    const leftWall = bodies.rectangle(0, 0, 1, 600, { isStatic: true });
    const rightWall = bodies.rectangle(600, 0, 1, 600, { isStatic: true });
    const topWall = bodies.rectangle(0, 600, 600, 1, { isStatic: true });
    const bottomWall = bodies.rectangle(600, 0, 600, 1, { isStatic: true });

    // add all of the bodies to the world
    composite.add(engine.world, [
      this.game.players[0],
      this.game.players[1],
      leftWall,
      rightWall,
      topWall,
      bottomWall,
    ]);
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
        
        this.game.ball = this._ballPhysics(this.game.ball);
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

  private _ballPhysics(ball: Ball): Ball {
    // apply physics.js
    //
    return new Ball();
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
