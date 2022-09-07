import { Vector } from './vector.entity';

export class PlayerGrid {
  side: number;
  coordinates: Vector;
}

export class GameGrid {
  constructor() {
    this.ball = { x: 300, y: 300 };
    this.players = [];
  }

  ball: Vector;
  players: PlayerGrid[];
}
