import { useCallback, useEffect, useState } from "react";
import { Stage, Layer, Rect, Line, Text } from "react-konva";

const Game = (props: any) => {
  // Enum
  enum movement {
    UP = 0,
    DOWN,
  }

  const enum Motive {
    WIN = 0,
    ABANDON,
    CANCEL,
  }

  const params = Object.freeze({
    CANVASW: 700,
    CANVASH: 600,
    BARWIDTH: 12,
    BARHEIGHT: 54,
    WALLSIZE: 15,
    BALLSIZE: 12,
    FONTSIZE: 40,
    BARFILL: "#0a0629",
    BARSHADOW: 15,
    BARSHADOWCOLOR: '#FF6ADE',
    BARSTROKE: "#eb89d6",
    BALLFILL: "#0a0629",
    BALLSHADOW: 15,
    BALLSHADOWCOLOR: '#60c2c2',
    BALLSTROKE: "#b4e8f1",
    WALLFILL: "white",
    BGFILL: "black",
    TEXTCOLOR: "white",
    MESSAGECOLOR: "yellow",
  });

  // States
  const socket = props.socket;
  const [grid, setGrid] = useState({} as any);
  const [scores, setScores] = useState([]);
  const [message, setMessage] = useState("");

  // Init
  const initGame = () => {
    if (props.action === props.actionVal.JOIN_GAME) {
      socket.emit("joinGame", { id: props.id });
      props.setMatchMaking(props.matchMakingVal.IN_GAME);
    }
    else if (props.action === props.actionVal.VIEW_GAME)
      socket.emit("viewGame", { id: props.id });
    else if (props.action === props.actionVal.RECO_GAME)
      socket.emit("reconnectGame", { id: props.id });
    socket.emit("getGameGrid", { id: props.id });
  };

  // Handlers
  const handleMove = (event: any) => {
    if (event.key === "w" || event.key === "W") {
      socket.emit("updateGame", { move: movement.UP, id: props.id });
    }
    if (event.key === "s" || event.key === "S") {
      socket.emit("updateGame", { move: movement.DOWN, id: props.id });
    }
  };

  const handleGridUpdate = useCallback((gridUpdate: any) => {
    setGrid(gridUpdate);
  }, []);

  const handleScoresUpdate = useCallback((scoreUpdate: any) => {
    setScores(scoreUpdate);
  }, []);

  const handleGameEnd = useCallback(
    (motive: number) => {
      if (motive === Motive.WIN)
        setMessage("The game is over. Moving back to lobby ...");
      if (motive === Motive.ABANDON)
        setMessage("One player abandoned. Moving back to lobby ...");
      if (motive === Motive.CANCEL)
        setMessage("Player canceled the game. Moving back to lobby ...");
      setTimeout(() => {
        props.backToLobby({ id: "lobby", action: props.actionVal.GO_LOBBY });
      }, 4000);
    },
    [props, Motive.WIN, Motive.ABANDON, Motive.CANCEL]
  );

  useEffect(() => {
    initGame();
    socket.on("updateGrid", handleGridUpdate);
    socket.on("updateScores", handleScoresUpdate);
    socket.on("gameEnd", handleGameEnd);
    if (props.action !== props.actionVal.VIEW_GAME)
      document.addEventListener("keydown", handleMove);
    return () => {
      socket.off("updateGrid", handleGridUpdate);
      socket.off("updateScores", handleScoresUpdate);
      socket.off("gameEnd", handleGameEnd);
      document.removeEventListener("keydown", handleMove);
    };
  }, []);

  // Game
  let wallsRect: any = [];
  let playersRect: any = [];
  let playersScores: any = [];
  let gameBall;
  if (scores) {
    playersScores = scores.map((player: any, index: number) => (
      <Text
        key={index}
        text={player.score.toString()}
        fontSize={70}
        align={index ? "right" : "left"}
        fill={params.TEXTCOLOR}
        x={player.side ? params.CANVASW / 2 + 20 : params.CANVASW / 2 - 60}
        y={30}
        fontStyle="bold"
      />
    ));
  }
  if (grid) {
    if (grid.players)
      playersRect = grid.players.map((player: any, index: number) => (
        <Rect
          key={index}
          width={params.BARWIDTH}
          height={params.BARHEIGHT}
          x={player.coordinates.x}
          y={player.coordinates.y}
          fill={params.BARFILL}
          shadowBlur={params.BARSHADOW}
          shadowColor={params.BARSHADOWCOLOR}
          stroke={params.BARSTROKE}
        />
      ));
    if (grid.ball)
      gameBall = (
        <Rect
          width={params.BALLSIZE}
          height={params.BALLSIZE}
          x={grid.ball.x}
          y={grid.ball.y}
          fill={params.BALLFILL}
          shadowBlur={params.BALLSHADOW}
          shadowColor={params.BALLSHADOWCOLOR}
          stroke={params.BALLSTROKE}
        />
      );
    if (grid.walls)
      wallsRect = grid.walls.map(
        (wall: any, index: number) =>
          wall && (
            <Rect
              key={index}
              width={params.CANVASW}
              height={params.WALLSIZE}
              x={wall.coordinates.x}
              y={wall.coordinates.y}
              fill={params.WALLFILL}
            />
          )
      );
  }

  // Messages
  let gameMessage;
  if (message) {
    gameMessage = (
      <Text
        text={message}
        fontSize={params.FONTSIZE}
        align="center"
        fill={params.MESSAGECOLOR}
        width={params.CANVASW}
        y={params.CANVASW / 2 - 2 * params.FONTSIZE}
        fontStyle="bold"
      />
    );
  }

  return (
    <>
      <Stage width={params.CANVASW} height={params.CANVASH}>
        <Layer name="background">
          <Rect
            width={params.CANVASW}
            height={params.CANVASH}
            fill={params.BGFILL} />
          <Line
            name="let"
            points={[params.CANVASW / 2, 0, params.CANVASW / 2, params.CANVASH]}
            stroke={params.BALLFILL}
            strokeWidth={10}
            dash={[20, 10]}
          ></Line>
          {playersScores}
        </Layer>
        <Layer>
          {wallsRect}
          {playersRect}
          {gameBall}
        </Layer>
        <Layer>{gameMessage}</Layer>
      </Stage>
    </>
  );
};

export default Game;
