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
  const [gameList, setGameList] = useState([] as any);
  const [game, setGame] = useState({action: Action.GO_LOBBY, id: 'lobby'});
  const [message, setMessage] = useState({} as any);

  // Handlers
  const handleConnect = useCallback(() => {
    setGame({action: Action.GO_LOBBY, id: 'lobby'});
    socket.emit('findAllGame');
  }, [socket, Action]);

  const handleGameList = useCallback((gameList: any) => {
    setGameList(gameList);
  }, []);

  const handleNewGame = () => {
    socket.emit("createGame");
  };

  const handleNewGameId = (data: any) => {
    setMessage({});
    setGame({ id: data.id, action: Action.CREATE_GAME });
  };

  const handleException = (data: any) => {
    setMessage({message: data.message});
  };

	const handleReconnect = (gameId: any) => {
    setMessage({});
    setGame({ id: gameId, action: Action.RECO_GAME });
  };

  const backToLobby = (room: any) => {
    socket.emit('findAllGame');
    setMessage({});
    setGame(room);
  }

  const handleInfo = (info: any) => {
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
          game && game.action === Action.GO_LOBBY 
          &&
          <GameList gameList={gameList} setGame={setGame} handleNewGame={handleNewGame} actionVal={Action} />
        }
      </div>
			<div>
        {
          game && game.action > Action.GO_LOBBY
          && (
            <Game
              socket={socket}
              id={game.id}
              action={game.action}
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
