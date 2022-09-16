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
    canvas: { fill: "black", size : { w:700, h: 600 }},
    paddle: { size: { w: 12, h: 54 }, fill: "#0a0629", stroke: "#eb89d6", shadow: 15, shadowColor: "#FF6ADE" },
    ball: { size: 12, fill: "#0a0629", stroke: "#b4e8f1", shadow: 15, shadowColor: "#60c2c2" },
    wall: { size: 15, fill: "#b4e8f1", stroke: "#b4e8f1", shadow: 15, shadowColor: "#60c2c2" },
    text: { size: 40, fill: "#eb89d6", stroke: "#eb89d6", shadow: 15, shadowColor: "#FF6ADE" },
    altText: { size: 40, fill: "#b4e8f1", stroke: "#eb89d6", shadow: 20, shadowColor: "#60c2c2" },
    score: { size: 70, style: "bold", fill: "#0a0629", stroke: "#eb89d6", shadow: 20, shadowColor: "#FF6ADE" }
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
        fontSize={params.score.size}
        align={index ? "right" : "left"}
        fill={params.text.fill}
        x={player.side ? params.canvas.size.w / 2 + 20 : params.canvas.size.w / 2 - 60}
        y={30}
        fontStyle={params.score.style}
      />
    ));
  }
  if (grid) {
    if (grid.players)
      playersRect = grid.players.map((player: any, index: number) => (
        <Rect
          key={index}
          width={params.paddle.size.w}
          height={params.paddle.size.h}
          x={player.coordinates.x}
          y={player.coordinates.y}
          fill={params.paddle.fill}
          shadowBlur={params.paddle.shadow}
          shadowColor={params.paddle.shadowColor}
          stroke={params.paddle.stroke}
        />
      ));
    if (grid.ball)
      gameBall = (
        <Rect
          width={params.ball.size}
          height={params.ball.size}
          x={grid.ball.x}
          y={grid.ball.y}
          fill={params.ball.fill}
          shadowBlur={params.ball.shadow}
          shadowColor={params.ball.shadowColor}
          stroke={params.ball.stroke}
        />
      );
    if (grid.walls)
      wallsRect = grid.walls.map(
        (wall: any, index: number) =>
          wall && (
            <Rect
              key={index}
              width={params.canvas.size.w}
              height={params.wall.size}
              x={wall.coordinates.x}
              y={wall.coordinates.y}
              fill={params.wall.fill}
              shadowBlur={params.wall.shadow}
              shadowColor={params.wall.shadowColor}
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
        fontSize={params.altText.size}
        align="center"
        fill={params.altText.fill}
        width={params.canvas.size.w}
        y={params.canvas.size.w / 2 - 2 * params.canvas.size.w}
        fontStyle="bold"
        shadowBlur={params.altText.shadow}
        shadowColor={params.altText.shadowColor}
      />
    );
  }

  return (
    <Stage width={params.canvas.size.w} height={params.canvas.size.h} container="stage">
      <Layer name="background">
        <Rect
          width={params.canvas.size.w}
          height={params.canvas.size.h}
          fill={params.canvas.fill} />
        <Line
          name="let"
          points={[params.canvas.size.w / 2, 0, params.canvas.size.w / 2, params.canvas.size.h]}
          stroke={params.wall.stroke}
          fill={params.wall.fill}
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
  );
};

export default Game;
