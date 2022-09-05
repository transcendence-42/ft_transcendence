export class GameParams {
  constructor() {
    this.canvasW = 600;
    this.canvasH = 600;
    this.moveSpeed = 5;
    this.barWidth = 10;
    this.barHeight = 50;
    this.barFill = 'yellow';
    this.barBorder = 'yellow';
    this.ballRadius = 10;
    this.ballFill = 'yellow';
    this.ballBorder = 'yellow';
    this.bgFill = 'black';
    this.wallSize = 10;
  }

  canvasW: number;
  canvasH: number;
  moveSpeed: number;
  barWidth: number;
  barHeight: number;
  barFill: string;
  barBorder: string;
  ballRadius: number;
  ballFill: string;
  ballBorder: string;
  bgFill: string;
  wallSize: number;
}
