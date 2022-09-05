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
  ball: Coordinates;
  playersCoordinates: PlayerCoordinates[];
}
