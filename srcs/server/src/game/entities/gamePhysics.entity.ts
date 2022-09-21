import { Dimensions } from './dimensions.entity';
import { Vector } from './vector.entity';

export class Physic {
  coordinates: Vector;
  dimensions: Dimensions;
  type: number;
  direction?: Vector;
  speed?: number;
  side?: number;
  timerFunction?: NodeJS.Timer;

  toJson?(): any {
    return {
      coordinates: this.coordinates?.toJson(),
      dimensions: this.dimensions?.toJson(),
      type: this.type,
      direction: this.direction?.toJson(),
      speed: this.speed,
      side: this.side,
      timerFunction: this.timerFunction,
    };
  }
}

export class GamePhysics {
  constructor() {
    this.ball = new Physic();
    this.players = [];
    this.goals = [];
    this.walls = [];
  }

  ball: Physic;
  players: Physic[];
  goals: Physic[];
  walls: Physic[];

  toJson?(): any {
    return {
      ball: this.ball?.toJson(),
      players: this.players.map((p: any) => p.toJson()),
      goals: this.players.map((g: any) => g.toJson()),
      walls: this.players.map((w: any) => w.toJson()),
    };
  }
}
