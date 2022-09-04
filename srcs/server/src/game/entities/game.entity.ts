import { GameCanvas } from './gameCanvas.entity';
import { GameParams } from './gameParams.entity';
import { Player } from './player.entity';
import { Client } from './client.entity';
import { GamePhysics } from './gamePhysics.entity';

export class Game {
  constructor() {
    this.gameCanvas = new GameCanvas();
    this.gameParams = new GameParams();
    this.gamePhysics = new GamePhysics();
  }

  roomId: string;
  players: Player[];
  viewers?: Client[];
  gameParams?: GameParams;
  gameCanvas?: GameCanvas;
  gamePhysics?: GamePhysics;
}
