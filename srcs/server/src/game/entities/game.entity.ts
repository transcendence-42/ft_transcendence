import { GameGrid } from './gameGrid.entity';
import { Player } from './player.entity';
import { Client } from './client.entity';
import { GamePhysics } from './gamePhysics.entity';

export class Game {
  constructor(id: string) {
    this.gameGrid = new GameGrid();
    this.gamePhysics = new GamePhysics();
    this.players = [];
    this.viewers = [];
    this.id = id;
    this.status = 0;
  }

  id: string;
  status: 0 | 1 | 2 | 3 | 4;
  players: Player[];
  viewers?: Client[];
  gameGrid?: GameGrid;
  gamePhysics?: GamePhysics;

  toJson?(): any {
    return {
      id: this.id,
      status: this.status,
      players: this.players.map((p: any) => p.toJson()),
      viewers: this.viewers.map((v: any) => v.toJson()),
      gameGrid: this.gameGrid?.toJson(),
      gamePhysics: this.gamePhysics?.toJson(),
    };
  }
}
