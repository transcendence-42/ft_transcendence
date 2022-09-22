import { Dimensions } from './dimensions.entity';
import { Vector } from './vector.entity';

export class Physic {
  coordinates: Vector;
  dimensions: Dimensions;
  type: string;
  direction?: Vector;
  speed?: number;
  side?: string;
  timerFunction?: NodeJS.Timer;
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
