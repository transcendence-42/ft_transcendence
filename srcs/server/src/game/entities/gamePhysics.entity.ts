import Matter from 'matter-js';

export class GamePhysics {
  constructor() {
    this.engine = Matter.Engine.create();
    this.bodies = Matter.Bodies;
  }

  engine: Matter.Engine;
  bodies: Matter.Bodies;
  composite: Matter.Composite;
  players?: Matter.Body[];
  walls?: Matter.Body[];
  ball?: Matter.Body;
}
