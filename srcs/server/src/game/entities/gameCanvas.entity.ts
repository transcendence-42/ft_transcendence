import { Position } from './position.entity';

export class GameCanvas {
  constructor() {
    this.ball.x = 300;
    this.ball.y = 300;
    this.playersPosition[0] = { x: 50, y: 275 };
  }

  ball: Position;
  playersPosition: Position[];
}
