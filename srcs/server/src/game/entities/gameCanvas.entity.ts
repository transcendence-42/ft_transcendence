export class Position {
  x: number;
  y: number;
}

export class PlayerPosition {
	playerId: number;
	position: Position;
}

export class GameCanvas {
  constructor() {
    this.ball.x = 300;
    this.ball.y = 300;
	}

  ball: Position;
  playersPosition: PlayerPosition[];
}
