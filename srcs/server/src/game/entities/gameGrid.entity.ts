import { Vector } from './vector.entity';

export class PlayerCoordinates {
  playerId: string;
  playerSide: number;
  coordinates: Vector;
}

export class GameGrid {
  constructor() {
    this.ball = { x: 300, y: 300 };
    this.players = [];
  }

  ball: Vector;
  players: PlayerCoordinates[];
}
