import { Vector } from './vector.entity';

export class PlayerGrid {
  side: string;
  coordinates: Vector;
}

export class WallGrid extends PlayerGrid {}

export class GameGrid {
  constructor() {
    this.players = [];
    this.walls = [];
  }

  ball: Vector;
  players: PlayerGrid[];
  walls: WallGrid[];
}
