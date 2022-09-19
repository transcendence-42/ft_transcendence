import { useRef, useEffect } from 'react';
import {
  drawBall,
  drawMessages,
  drawPaddles,
  drawScores,
  drawStage,
} from '../../Pages/Game/utils/draw';
import './canvas.css';

const Canvas = (props: any) => {
  const { grid, scores, message, map } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = (ctx: any, grid: any, scores: any, message: any, map: any) => {
    ctx.clearRect(0, 0, map.canvas.size.w, map.canvas.size.h);
    ctx.beginPath();
    if (scores.length > 1) {
      drawStage(ctx, grid, map);
      drawScores(ctx, scores, map);
      drawPaddles(ctx, grid, map);
      drawBall(ctx, grid, map);
    }
    drawMessages(ctx, message, map);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    draw(context, grid, scores, message, map);
  }, [grid, map, message, scores]);

  return (
    <canvas
      ref={canvasRef}
      width={map.canvas.size.w}
      height={map.canvas.size.h}
    />
  );
};

export default Canvas;
