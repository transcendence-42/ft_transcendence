import { useCallback, useEffect, useState } from "react";
import { Stage, Layer, Rect, Circle, Line } from "react-konva";

const Game = (props: any) => {
  // Enum
  enum movement {
    UP = 0,
    DOWN,
  }

  const params = Object.freeze({
    CANVASW: 600,
    CANVASH: 600,
    BARWIDTH: 10,
    BARHEIGHT: 50,
    BARFILL: "yellow",
    BARBORDER: "yellow",
    BALLRADIUS: 10,
    BALLFILL: "yellow",
    BALLBORDER: "yellow",
    WALLBORDER: "yellow",
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
      console.log(`room id : ${props.room}`);
      socket.emit("updateGame", { move: movement.UP, id: props.room });
    }
    if (event.key === "s" || event.key === "S") {
      socket.emit("updateGame", { move: movement.DOWN, id: props.room });
    }
  };

  const handleBackToLobby = () => {
    // Should remove a viewer and change its room in the server
    // Should end a match if player with opponent and delete the match
    // Should cancel and delete a match if player alone
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
      document.removeEventListener("keydown", handleMove);
    };
  }, []);

  let wallsRect = [];
  let playersRect = [];
  let gameBall;
  if (grid) {
    if (grid.players)
      playersRect = grid.players.map(
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
    if (grid.walls)
      wallsRect = grid.walls.map(
        (wall: any, index: number) =>
          wall && (
            <Rect
              key={index}
              width={wall.side ? params.WALLSIZE : params.CANVASW}
              height={wall.side ? params.CANVASH : params.WALLSIZE}
              x={wall.coordinates.x}
              y={wall.coordinates.y}
              stroke={params.WALLBORDER}
            />
          )
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
          <Line
            name="let"
            points={[params.CANVASW / 2, 0, params.CANVASW / 2, params.CANVASH]}
            stroke={params.BALLFILL}
            dash={[15, 10]}
          ></Line>
        </Layer>
        <Layer>
          {wallsRect}
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
