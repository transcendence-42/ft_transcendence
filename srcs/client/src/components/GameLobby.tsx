import { useCallback, useContext, useEffect, useState } from "react";
import { SocketContext } from "../socket";
import GameList from "./GameList";
import Game from "./Game";

const GameLobby = () => {
  // Enums
  enum type {
    LOBBY = 0,
    CREATE_GAME,
    JOIN_GAME,
    SPECTATE_GAME,
  }

  // States
  const socket = useContext(SocketContext);
  const [games, setGames] = useState({} as any);
  const [room, setRoom] = useState({} as any);

  // Handlers
  const handleConnect = useCallback(() => {
    console.log(`connection from client: ${socket.id}`);
    setRoom({type: type.LOBBY, id: 'lobby'});
    socket.emit('findAllGame');
  }, [socket, type]);

  const handleGameList = useCallback((gameList: any) => {
    setGames(gameList);
  }, []);

  const handleNewGame = () => {
    setRoom({ id: "0", type: type.CREATE_GAME });
  };

  useEffect(() => {
    socket.on("connect", handleConnect);
    socket.on("gameList", handleGameList);
  });

  // Render
  return (
    <div>
      <div>
        {room && room.type === type.LOBBY 
        && games ? (
          <GameList games={games} setRoom={setRoom} type={type} />
        ) : (
          <p>No games</p>
        )
        && <button onClick={handleNewGame}>Create New Game</button>}
      </div>
      {room &&
        room.type ===
          (type.CREATE_GAME || type.SPECTATE_GAME || type.JOIN_GAME) && (
          <Game
            socket={socket}
            room={room.id}
            action={room.type}
            setRoom={setRoom}
            type={type}
          />
        )}
    </div>
  );
};

export default GameLobby;
