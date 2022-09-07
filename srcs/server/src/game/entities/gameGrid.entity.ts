import { Vector } from './vector.entity';

export class PlayerGrid {
  side: number;
  coordinates: Vector;
}

export class GameGrid {
  constructor() {
    this.players = [];
  }

  ball: Vector;
  players: PlayerGrid[];
}
