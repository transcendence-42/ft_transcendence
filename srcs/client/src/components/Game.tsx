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
  const [grid, setGrid] = useState({} as any);
  const [params, setParams] = useState({} as any);

  // Init
  const initGame = () => {
    console.log('init');
    if (props.action === props.actionVal.CREATE_GAME)
      socket.emit("getGameInfo", { id: props.room });
    if (props.action === props.actionVal.JOIN_GAME)
    socket.emit("joinGame", {
      id: props.room,
      player: { socketId: socket.id },
    });
    else if (props.action === props.actionVal.VIEW_GAME)
    socket.emit("viewGame", {
      id: props.room,
      viewer: { socketId: socket.id },
    });
    else if (props.action === props.actionVal.RECO_GAME)
      socket.emit("reconnectGame", { id: props.room });
    
  };

  // Handlers
  const handleMove = (event: any) => {
    if (event.key === "w" || event.key === "W") {
      socket.emit("updateGame", { move: movement.UP, id: props.room });
    }
    if (event.key === "s" || event.key === "S") {
      socket.emit("updateGame", { move: movement.DOWN, id: props.room });
    }
  };

  const handleBackToLobby = () => {
    props.backToLobby({ id: "lobby", action: props.actionVal.GO_LOBBY });
  };

  const handleGridUpdate = useCallback((gridUpdate: any) => {
    setGrid(gridUpdate);
  }, []);

  const handleParams = useCallback((params: any) => {
    setParams(params);
  }, []);

  const handlePlayerLeft = useCallback((params: any) => {
    console.log(`Info : ${params.message}`);
  }, []);

  useEffect(() => {
    initGame();
    socket.on("updateGrid", handleGridUpdate);
    socket.on("gameParams", handleParams);
    socket.on("playerLeft", handlePlayerLeft);
    document.addEventListener("keydown", handleMove);
  }, []);

  let playersRect = [];
  let gameBall;
  if (grid) {
    console.log(JSON.stringify(grid));
    if (grid.playersCoordinates)
      playersRect = grid.playersCoordinates.map(
        (player: any, index: number) =>
          player && (
            <Rect
              key={index}
              width={params.barWidth}
              height={params.barHeight}
              x={player.coordinates.x}
              y={player.coordinates.y}
              fill={params.barFill}
            />
          )
      );
    if (grid.ball)
      gameBall = (
        <Circle
          x={grid.ball.x}
          y={grid.ball.y}
          radius={params.ballRadius}
          fill={params.ballFill}
        />
      );
  }

  // styles
  const styles: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  };

  return (
    <div style={styles}>
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
      <button onClick={handleBackToLobby} style={styles}>
        Go back to lobby
      </button>
    </div>
  );
};

export default Game;
