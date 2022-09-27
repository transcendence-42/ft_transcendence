export class Vector {
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  x: number;
  y: number;

  toJson?(): any {
    return {
      x: this.x,
      y: this.y,
    };
  }
}
