import { GameGrid } from './gameGrid.entity';
import { Player } from './player.entity';
import { Client } from './client.entity';
import { GamePhysics } from './gamePhysics.entity';

export class Game {
  constructor(roomId: string) {
    this.gameGrid = new GameGrid();
    this.gamePhysics = new GamePhysics();
    this.players = [];
    this.viewers = [];
    this.roomId = roomId;
  }

  roomId: string;
  players: Player[];
  viewers?: Client[];
  gameGrid?: GameGrid;
  gamePhysics?: GamePhysics;
}
