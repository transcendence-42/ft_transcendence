export class Dimensions {
  h?: number;
  w?: number;
  r?: number;

  toJson?(): any {
    return {
      h: this.h,
      w: this.w,
      r: this.r,
    };
  }
}
