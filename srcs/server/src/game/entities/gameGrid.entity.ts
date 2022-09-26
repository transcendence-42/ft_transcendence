import { Vector } from './vector.entity';

export class PlayerGrid {
  side: number;
  coordinates: Vector;

  toJson?(): any {
    return {
      side: this.side,
      coordinates: this.coordinates.toJson(),
    };
  }
}

export class WallGrid extends PlayerGrid {
  toJson?(): any {
    return {
      ...super.toJson(),
    };
  }
}

export class GameGrid {
  constructor() {
    this.players = [];
    this.walls = [];
  }

  ball: Vector;
  players: PlayerGrid[];
  walls: WallGrid[];

  toJson?(): any {
    return {
      ball: this.ball?.toJson(),
      players: this.players.map((p: any) => p.toJson()),
      walls: this.walls.map((w: any) => w.toJson()),
    };
  }
}
