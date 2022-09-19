import { useRef, useEffect } from 'react';

const useCanvas = (draw: any) => {
  
  // Get canvas from ref
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    // Get canvas context
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    // Draw in canvas
    draw(context);
  }, [draw])
  
  return canvasRef;
}

export default useCanvas;