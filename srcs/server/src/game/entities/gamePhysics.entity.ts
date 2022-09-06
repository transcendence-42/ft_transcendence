import Matter from 'matter-js';

export class GamePhysics {
  constructor() {
    this.players = [];
    this.walls = [];
  }

  engine?: Matter.Engine;
  composite?: Matter.Composite;
  players?: Matter.Body[];
  walls?: Matter.Body[];
  ball?: Matter.Body;
}
