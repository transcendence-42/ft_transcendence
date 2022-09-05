import Matter from 'matter-js';

export class GamePhysics {
  engine?: Matter.Engine;
  composite?: Matter.Composite;
  players?: Matter.Body[];
  walls?: Matter.Body[];
  ball?: Matter.Body;
}
