import { useCallback, useEffect, useState } from "react";
import { Stage, Layer, Rect, Circle } from "react-konva";

const Game = (props: any) => {
  // Enum
  enum movement {
    UP = 0,
    DOWN,
  }

  const params = Object.freeze({
    CANVASW: 600,
    CANVASH: 600,
    MOVESPEED: 5,
    BARWIDTH: 10,
    BARHEIGHT: 50,
    BARFILL: "yellow",
    BARBORDER: "yellow",
    BALLRADIUS: 10,
    BALLFILL: "yellow",
    BALLBORDER: "yellow",
    BGFILL: "black",
    WALLSIZE: 10,
  });

  // States
  const socket = props.socket;
  const [grid, setGrid] = useState({} as any);

  // Init
  const initGame = () => {
    console.log("init");
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
    socket.emit("getGameGrid", { id: props.room });
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
    if (
      props.action !== props.actionVal.VIEW_GAME &&
      window.confirm("Do you want to abandon the game ?")
    ) {
      socket.emit("playerLeave", { id: props.room });
    }
    props.backToLobby({ id: "lobby", action: props.actionVal.GO_LOBBY });
  };

  const handleGridUpdate = useCallback((gridUpdate: any) => {
    setGrid(gridUpdate);
  }, []);

  const handlePlayerLeft = useCallback((params: any) => {
    console.log(`Info : ${params.message}`);
  }, []);

  useEffect(() => {
    initGame();
    socket.on("updateGrid", handleGridUpdate);
    socket.on("playerLeft", handlePlayerLeft);
    if (props.action !== props.actionVal.VIEW_GAME)
      document.addEventListener("keydown", handleMove);
    return () => {
      socket.off("updateGrid", handleGridUpdate);
      socket.off("playerLeft", handlePlayerLeft);
    };
  }, []);

  let playersRect = [];
  let gameBall;
  if (grid) {
    if (grid.playersCoordinates)
      playersRect = grid.playersCoordinates.map(
        (player: any, index: number) =>
          player && (
            <Rect
              key={index}
              width={params.BARWIDTH}
              height={params.BARHEIGHT}
              x={player.coordinates.x}
              y={player.coordinates.y}
              fill={params.BARFILL}
            />
          )
      );
    if (grid.ball)
      gameBall = (
        <Circle
          x={grid.ball.x}
          y={grid.ball.y}
          radius={params.BALLRADIUS}
          fill={params.BALLFILL}
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
      <Stage width={params.CANVASW} height={params.CANVASH}>
        <Layer name="background">
          <Rect
            width={params.CANVASW}
            height={params.CANVASH}
            fill={params.BGFILL}
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
