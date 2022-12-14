import { Dimensions } from './dimensions.entity';
import { Vector } from './vector.entity';

export class Physic {
  coordinates: Vector;
  dimensions: Dimensions;
  type: number;
  direction?: Vector;
  speed?: number;
  side?: number;
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
}
