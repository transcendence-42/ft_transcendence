import useCanvas from "./CanvasHook";

const Canvas = (props: any) => {

  // Get draw function from props
  const { draw, ...rest } = props;

  // Use hook with draw function
  const canvasRef = useCanvas(draw);

  return <canvas ref={canvasRef} {...props} />
}

export default Canvas;
