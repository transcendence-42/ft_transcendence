export class GameParams {
  constructor() {
    this.canvasW = 600;
    this.canvasH = 600;
    this.moveSpeed = 5;
    this.barWidth = 20;
    this.barHeight = 10;
    this.barFill = 'white';
    this.barBorder = 'white';
    this.ballRadius = 10;
    this.ballFill = 'yellow';
    this.ballBorder = 'yellow';
    this.bgFill = 'black';
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
}
