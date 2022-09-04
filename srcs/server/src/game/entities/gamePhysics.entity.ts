import * as Matter from 'matter-js';

export class GamePhysics {
  engine: Matter.Engine;
  bodies: Matter.Bodies;
  composite: Matter.Composite;
  players: Matter.Body[];
  ball: Matter.Body;
}
