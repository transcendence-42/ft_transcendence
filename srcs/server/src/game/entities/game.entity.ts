import { GameCanvas } from './gameCanvas.entity';
import { GameParams } from './gameParams.entity';
import { Player } from './player.entity';
import { Client } from './client.entity';

export class Game {
  roomId: number;
  players: Player[];
  viewers: Client[];
  gameParams: GameParams;
  gameCanvas: GameCanvas;
}
