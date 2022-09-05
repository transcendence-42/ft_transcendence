import Matter from 'matter-js';

export class GamePhysics {
  constructor() {
    this.engine = Matter.Engine.create();
  }

  engine: Matter.Engine;
  composite: Matter.Composite;
  players?: Matter.Body[];
  walls?: Matter.Body[];
  ball?: Matter.Body;
}
