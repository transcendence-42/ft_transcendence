/** Draw walls and separation line */
export const drawStage = (
  ctx: CanvasRenderingContext2D,
  grid: any,
  map: any,
) => {
  // draw separation line
  ctx.setLineDash([20, 10]); /*dashes are 5px and spaces are 3px*/
  ctx.beginPath();
  ctx.moveTo(map.canvas.size.w / 2, 0 + (15 - map.wall.size));
  ctx.lineTo(map.canvas.size.w / 2, map.canvas.size.h - (15 - map.wall.size));
  ctx.strokeStyle = map.wall.fill;
  ctx.shadowBlur = map.wall.shadow;
  ctx.shadowColor = map.wall.shadowColor;
  ctx.lineWidth = 8;
  ctx.stroke();
  // draw walls
  if (grid.walls) {
    grid.walls.forEach((wall: any, i: number) => {
      ctx.fillStyle = map.wall.fill;
      ctx.shadowBlur = map.wall.shadow;
      ctx.shadowColor = map.wall.shadowColor;
      ctx.fillRect(
        wall.coordinates.x,
        i ? wall.coordinates.y : wall.coordinates.y + (15 - map.wall.size),
        map.canvas.size.w,
        map.wall.size,
      );
    });
  }
};

/** Draw scores */
export const drawScores = (
  ctx: CanvasRenderingContext2D,
  scores: any,
  map: any,
) => {
  if (scores) {
    // Get current canvas width
    const cWidth: any = document
      .getElementById('pongCanvas')
      ?.getAttribute('width');
    let display: string = '';
    scores.forEach((s: any) => {
      if (s.side === 0) display = s.score.toString() + ' ' + display;
      else if (display) display = display + s.score.toString();
      else display = display + ' ' + s.score.toString();
    });
    ctx.font = `${map.score.style} ${+cWidth * 0.078}px ${map.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.shadowBlur = map.score.shadow;
    ctx.shadowColor = map.score.shadowColor;
    ctx.fillStyle = map.text.fill;
    ctx.fillText(display, map.canvas.size.w / 2, 30);
  }
};

/** Draw scores */
export const drawUsernames = (
  ctx: CanvasRenderingContext2D,
  scores: any,
  map: any,
) => {
  if (scores) {
    // Get current canvas width
    const cWidth: any = document
      .getElementById('pongCanvas')
      ?.getAttribute('width');
    let display: string = '';
    scores.forEach((s: any) => {
      ctx.font = `${map.score.style} ${+cWidth * 0.028}px ${map.fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.shadowBlur = map.score.shadow;
      ctx.shadowColor = map.score.shadowColor;
      ctx.fillStyle = map.text.fill;
      const wPos =
        +s.side === 0 ? map.canvas.size.w / 4 : map.canvas.size.w / 1.33;
      ctx.fillText(display, map.canvas.size.w / wPos, 30);
    });
    ctx.font = `${map.score.style} ${+cWidth * 0.078}px ${map.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.shadowBlur = map.score.shadow;
    ctx.shadowColor = map.score.shadowColor;
    ctx.fillStyle = map.text.fill;
    ctx.fillText(display, map.canvas.size.w / 2, 30);
  }
};

/** Draw player's paddles */
export const drawPaddles = (
  ctx: CanvasRenderingContext2D,
  grid: any,
  map: any,
) => {
  if (grid.players) {
    grid.players.forEach((player: any) => {
      ctx.fillStyle = map.paddle.fill;
      ctx.shadowBlur = map.paddle.shadow;
      ctx.shadowColor = map.paddle.shadowColor;
      ctx.fillRect(
        player.coordinates.x,
        player.coordinates.y,
        map.paddle.size.w,
        map.paddle.size.h,
      );
    });
  }
};

/** Draw ball */
export const drawBall = (
  ctx: CanvasRenderingContext2D,
  grid: any,
  map: any,
) => {
  if (grid.ball) {
    ctx.fillStyle = map.ball.fill;
    ctx.shadowBlur = map.ball.shadow;
    ctx.shadowColor = map.ball.shadowColor;
    ctx.fillRect(grid.ball.x, grid.ball.y, map.ball.size, map.ball.size);
  }
};

/** Draw information messages */
export const drawMessages = (
  ctx: CanvasRenderingContext2D,
  message: string,
  map: any,
) => {
  if (message !== '') {
    // Get current canvas width
    const cWidth: any = document
      .getElementById('pongCanvas')
      ?.getAttribute('width');
    // Draw background rect to hide stage
    ctx.fillStyle = map.canvas.fill;
    ctx.shadowBlur = 0;
    ctx.fillRect(
      map.paddle.size.w + 10,
      map.canvas.size.h / 2 - 50,
      map.canvas.size.w - 2 * map.paddle.size.w - 20,
      100,
    );
    // Draw message
    ctx.font = `${map.score.style} ${+cWidth * 0.044}px ${map.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = map.altText.fill;
    ctx.shadowBlur = map.altText.shadow;
    ctx.shadowColor = map.altText.shadowColor;
    ctx.fillText(message, map.canvas.size.w / 2, map.canvas.size.h / 2);
  }
};
