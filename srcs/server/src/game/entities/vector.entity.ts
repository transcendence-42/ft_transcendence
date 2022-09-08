const toDegrees = (radians: number): number => (radians * 180) / Math.PI;
const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

export class Vector {
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  x: number;
  y: number;

  add?(other: Vector): Vector {
    return new Vector(this.x + other.x, this.y + other.y);
  }

  substract?(other: Vector): Vector {
    return new Vector(this.x - other.x, this.y - other.y);
  }

  scaleBy?(scale: number): Vector {
    return new Vector(scale * this.x, scale * this.y);
  }

  dotProduct?(other: Vector): number {
    return this.x * other.x + this.y * other.y;
  }

  length?(): number {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  angleBetween?(other: Vector): number {
    return toDegrees(
      Math.acos(this.dotProduct(other) / (this.length() * other.length())),
    );
  }

  normalize?(): Vector {
    return this.scaleBy(1 / this.length());
  }

  negate?(): Vector {
    return this.scaleBy(-1);
  }

  projectOn?(other: Vector): Vector {
    const normalized = other.normalize();
    return normalized.scaleBy(this.dotProduct(normalized));
  }
}
