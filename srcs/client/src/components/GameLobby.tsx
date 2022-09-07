import { useCallback, useContext, useEffect, useState } from "react";
import { SocketContext } from "../socket";
import GameList from "./GameList";
import Game from "./Game";

const  GameLobby = () => {
  // Enums
  enum Action {
    GO_LOBBY = 0,
    CREATE_GAME,
    JOIN_GAME,
    VIEW_GAME,
		RECO_GAME,
  }
  
  // States
  const socket = useContext(SocketContext);
  const [games, setGames] = useState([] as any);
  const [room, setRoom] = useState({action: Action.GO_LOBBY, id: 'lobby'});
  const [message, setMessage] = useState({} as any);

  // Handlers
  const handleConnect = useCallback(() => {
    console.log(`connection from client: ${socket.id}`);
    setRoom({action: Action.GO_LOBBY, id: 'lobby'});
    socket.emit('findAllGame');
  }, [socket, Action]);

  const handleGameList = useCallback((gameList: any) => {
    console.log('get game list');
    console.log(JSON.stringify(gameList, null, 4));
    setGames(gameList);
  }, []);

  const handleNewGame = () => {
    socket.emit("createGame");
  };

  const handleNewGameId = (data: any) => {
    setMessage({});
    setRoom({ id: data.id, action: Action.CREATE_GAME });
  };

  const handleException = (data: any) => {
    console.log('exception : ' + data.message);
    setMessage({message: data.message});
  };

	const handleReconnect = (gameId: any) => {
    console.log('reconnect game');
    setMessage({});
    setRoom({ id: gameId, action: Action.RECO_GAME });
  };

  const backToLobby = (room: any) => {
    socket.emit('findAllGame');
    setMessage({});
    setRoom(room);
  }

  const handleInfo = (info: any) => {
    console.log(`Info: ${info.message}`);
  };

  useEffect(() => {
    socket.on("connect", handleConnect);
    socket.on("gameList", handleGameList);
    socket.on("reconnect", handleReconnect);
    socket.on('newGameId', handleNewGameId);
    socket.on('exception', handleException);
    socket.on("info", handleInfo);
    return () => {
      socket.off("connect", handleConnect);
      socket.off("gameList", handleGameList);
      socket.off("reconnect", handleReconnect);
      socket.off('newGameId', handleNewGameId);
      socket.off('exception', handleException);
      socket.off("info", handleInfo);
      socket.close();
    }
  }, []);

  // Render
  return (
    <div>
      <div>
        {
          room && room.action === Action.GO_LOBBY 
          &&
          <GameList games={games} setRoom={setRoom} handleNewGame={handleNewGame} actionVal={Action} />
        }
      </div>
			<div>
        {
          room && room.action > Action.GO_LOBBY
          && (
            <Game
              socket={socket}
              room={room.id}
              action={room.action}
              backToLobby={backToLobby}
              actionVal={Action}
            />
          )
        }
			</div>
      {
        message && <p>{message.message}</p>
      }
    </div>
  );
};

export default GameLobby;