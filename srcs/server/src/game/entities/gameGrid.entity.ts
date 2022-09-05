export class Coordinates {
  x: number;
  y: number;
}

export class PlayerCoordinates {
  playerId: string;
  playerSide: number;
  coordinates: Coordinates;
}

export class GameGrid {
  constructor() {
    this.ball = { x: 300, y: 300 };
    this.playersCoordinates = [];
  }

  ball: Coordinates;
  playersCoordinates: PlayerCoordinates[];
}
