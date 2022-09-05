import { useCallback, useContext, useEffect, useState } from "react";
import { SocketContext } from "../socket";
import GameList from "./GameList";
import Game from "./Game";

const GameLobby = () => {
  // Enums
  enum action {
    GO_LOBBY = 0,
    CREATE_GAME,
    JOIN_GAME,
    VIEW_GAME,
		RECO_GAME,
  }

  // States
  const socket = useContext(SocketContext);
  const [games, setGames] = useState({} as any);
  const [room, setRoom] = useState({} as any);

  // Handlers
  const handleConnect = useCallback(() => {
    console.log(`connection from client: ${socket.id}`);
    setRoom({action: action.GO_LOBBY, id: 'lobby'});
    socket.emit('findAllGame');
  }, [socket, action]);

  const handleGameList = useCallback((gameList: any) => {
    setGames(gameList);
  }, []);

  const handleNewGame = () => {
    setRoom({ id: "0", action: action.CREATE_GAME });
  };

	const handleReconnect = (gameId: any) => {
    setRoom({ id: gameId, action: action.RECO_GAME });
  };

  const handleInfo = (info: any) => {
    console.log(`Info: ${info.message}`);
  };

  useEffect(() => {
    socket.on("connect", handleConnect);
    socket.on("gameList", handleGameList);
    socket.on("reconnect", handleReconnect);
    socket.on("info", handleInfo);
  });

  // Render
  return (
    <div>
      <div>
        {room && room.action === action.GO_LOBBY 
        && games ? (
          <GameList games={games} setRoom={setRoom} actionVal={action} />
        ) : (
          <p>No games</p>
        )
        && <button onClick={handleNewGame}>Create New Game</button>}
      </div>
      {room &&
        room.action > 0 && (
          <Game
            socket={socket}
            room={room.id}
            action={room.type}
            setRoom={setRoom}
            actionVal={action}
          />
        )}
    </div>
  );
};

export default GameLobby;
