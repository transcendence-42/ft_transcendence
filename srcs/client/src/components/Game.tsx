import React, { useCallback, useContext, useEffect, useState } from "react";
import { SocketContext } from "../socket";
import { Stage, Layer, Rect, Circle } from "react-konva";

enum movement {
  UP = 0,
  DOWN
}

const Game = () => {
  const socket = useContext(SocketContext);
  const [game, setGame] = useState({} as any);

  const handleMove = (event: any) => {
    if (event.key === "w" || event.key === "W") {
      socket.emit("move", { move: movement.UP });
    }
    if (event.key === "s" || event.key === "S") {
      socket.emit("move", { move: movement.DOWN });
    }
  };
  const handleGameUpdate = useCallback((gameData: any) => {
    setGame(gameData);
  }, []);

  const handleConnect = useCallback(() => {
    console.log(`connection from client: ${socket.id}`);
  }, []);

  const handleBroadcast = useCallback((data: any) => {
    console.log("recieved broadcast: " + data.message);
    setGame(data.game);
  }, []);

  useEffect(() => {
    socket.on("broadcast", handleBroadcast);
    socket.on("updateGame", handleGameUpdate);
    socket.on("connect", handleConnect);
    document.addEventListener("keydown", handleMove);
  }, []);

  let playersRect = [];
  if (game && game.players)
    playersRect = game.players.map((player: any, index: number) => {
      if (player)
        return (
          <Rect
            key={player.socketId}
            width={10}
            height={50}
            y={player.y}
            x={player.x}
            fill="red"
          />
        );
      else return;
    });

  return (
    <div>
      <Stage width={600} height={600}>
        <Layer name="background">
          <Rect width={600} height={600} fill="blue" />
        </Layer>
        <Layer>{playersRect}</Layer>
      </Stage>
    </div>
  );
};

export default Game;
