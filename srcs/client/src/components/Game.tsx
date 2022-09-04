import { useCallback, useEffect, useState } from "react";
import { Stage, Layer, Rect, Circle } from "react-konva";

const Game = (props: any) => {
  // Enum
  enum movement {
    UP = 0,
    DOWN,
  }

  // States
  const socket = props.socket;
  const [canvas, setCanvas] = useState({} as any);
  const [params, setParams] = useState({} as any);

  // Init
  const initGame = () => {
    if (props.action === props.type.CREATE_GAME)
      socket.emit("createGame", { players: { socketId: socket.id } });
    else if (props.action === props.type.JOIN_GAME)
      socket.emit("updateGame", {
        param: { roomId: props.room },
        data: { players: { add: { socketId: socket.id } } },
      });
    else if (props.action === props.type.SPECTATE_GAME)
      socket.emit("updateGame", {
        param: { roomId: props.room },
        data: { viewers: { add: { socketId: socket.id } } },
      });
  };

  // Handlers
  const handleMove = (event: any) => {
    if (event.key === "w" || event.key === "W") {
      socket.emit("updateGame", { socketId: socket.id, move: movement.UP });
    }
    if (event.key === "s" || event.key === "S") {
      socket.emit("updateGame", { socketId: socket.id, move: movement.DOWN });
    }
  };

  const handleBackToLobby = () => {
    props.setRoom({ id: props.lobby, type: props.type.LOBBY });
  };

  const handleCanvasUpdate = useCallback((canvasUpdate: any) => {
    setCanvas(canvasUpdate);
  }, []);

  const handleInit = useCallback((data: any) => {
    console.log("Game initialization...");
    setCanvas(data.canvasUpdate);
  }, []);

  const handleParams = useCallback((params: any) => {
    setParams(params);
  }, []);

  useEffect(() => {
    initGame();
    socket.on("init", handleInit);
    socket.on("updateCanvas", handleCanvasUpdate);
    socket.on("gameParams", handleParams);
    document.addEventListener("keydown", handleMove);
  });

  let playersRect = [];
  let gameBall;
  if (canvas) {
    if (canvas.players)
      playersRect = canvas.players.map(
        (player: any, index: number) =>
          player && (
            <Rect
              key={index}
              width={params.barWitdth}
              height={params.barHeight}
              x={player.x}
              y={player.y}
              fill={params.barFill}
            />
          )
      );
    if (canvas.ball)
      gameBall = (
        <Circle
          x={canvas.ball.x}
          y={canvas.ball.y}
          radius={params.ballRadius}
          fill={params.ballFill}
        />
      );
  }

  return (
    <div>
      <Stage width={params.canvasW} height={params.canvasH}>
        <Layer name="background">
          <Rect
            width={params.canvasW}
            height={params.canvasH}
            fill={params.bgFill}
          />
        </Layer>
        <Layer>
          {playersRect}
          {gameBall}
        </Layer>
      </Stage>
      <button onClick={handleBackToLobby}>Go back to lobby</button>
    </div>
  );
};

export default Game;
