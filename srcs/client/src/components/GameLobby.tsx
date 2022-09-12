import { useCallback, useContext, useEffect, useState } from "react";
import { SocketContext } from "../socket";
import GameList from "./GameList";
import Game from "./Game";

const GameLobby = () => {
  // Enums
  enum Action {
    GO_LOBBY = 0,
    CREATE_GAME,
    JOIN_GAME,
    VIEW_GAME,
    RECO_GAME,
  }

  enum MatchMaking {
    NOT_IN_QUEUE = 0,
    IN_QUEUE,
    IN_GAME,
  }

  // States
  const socket = useContext(SocketContext);
  const [gameList, setGameList] = useState([] as any);
  const [game, setGame] = useState({ action: Action.GO_LOBBY, id: "lobby" });
  const [message, setMessage] = useState({} as any);
  const [matchMaking, setMatchMaking] = useState(MatchMaking.NOT_IN_QUEUE);

  // Socket events handlers
  const handleConnect = useCallback(() => {
    setGame({ action: Action.GO_LOBBY, id: "lobby" });
    socket.emit("findAllGame", (res: object) => {
      setGameList(res);
    });
  }, [socket, Action]);

  const handleGameList = useCallback((gameList: any) => {
    setGameList(gameList);
  }, []);

  const handleGameId = useCallback((data: any) => {
    setMessage({});
    setGame({ id: data.id, action: Action.CREATE_GAME });
  }, [Action]);
  
  const handleException = useCallback((data: any) => {
    setMessage({ message: data.message });
  }, []);

  const handleReconnect = useCallback((gameId: any) => {
    setMessage({});
    setGame({ id: gameId, action: Action.RECO_GAME });
  }, [Action]);

  const handleMatchMaking = useCallback((value: MatchMaking) => {
    setMatchMaking(value);
    socket.emit("matchMaking", { value: true });
  }, [socket]);

  const handleOpponentFound = useCallback(() => {
    setMessage({ message: "An opponent has been found, the game will start !"});
    setMatchMaking(MatchMaking.IN_GAME);
    setTimeout(() => {
      setMessage({});
    }, 4000);
  }, [MatchMaking]);
  
  const handleInfo = useCallback((info: any) => {
    setMessage({ message: info.message });
    setTimeout(() => {
      setMessage({});
    }, 4000);
  }, []);

  // component event handlers 
  const handleNewGame = () => {
    setMatchMaking(MatchMaking.IN_GAME);
    socket.emit("createGame");
  };

  const backToLobby = (room: any) => {
    socket.emit("findAllGame");
    setMessage({});
    setMatchMaking(MatchMaking.NOT_IN_QUEUE);
    setGame(room);
  };
  
  useEffect(() => {
    socket.on("connect", handleConnect);
    socket.on("gameList", handleGameList);
    socket.on("reconnect", handleReconnect);
    socket.on("gameId", handleGameId);
    socket.on("exception", handleException);
    socket.on("opponentFound", handleOpponentFound);
    socket.on("info", handleInfo);
    return () => {
      socket.off("connect", handleConnect);
      socket.off("gameList", handleGameList);
      socket.off("reconnect", handleReconnect);
      socket.off("gameId", handleGameId);
      socket.off("exception", handleException);
      socket.off("opponentFound", handleOpponentFound);
      socket.off("info", handleInfo);
      socket.close();
    };
  }, []);

  // Render
  return (
    <div>
      <div>
        {matchMaking === MatchMaking.NOT_IN_QUEUE ? (
          <button onClick={() => handleMatchMaking(MatchMaking.IN_QUEUE)}>
            Join queue
          </button>
        ) : (
          matchMaking === MatchMaking.IN_QUEUE && (
            <p>
              We are searching for an opponent ...
              <button
                onClick={() => handleMatchMaking(MatchMaking.NOT_IN_QUEUE)}
              >
                Cancel
              </button>
            </p>
          )
        )}
      </div>
      <div>
        {game && game.action === Action.GO_LOBBY && (
          <GameList
            gameList={gameList}
            setGame={setGame}
            handleNewGame={handleNewGame}
            actionVal={Action}
          />
        )}
      </div>
      <div>
        {game && game.action > Action.GO_LOBBY && (
          <Game
            socket={socket}
            id={game.id}
            action={game.action}
            backToLobby={backToLobby}
            actionVal={Action}
            setMatchMaking={setMatchMaking}
            matchMakingVal={MatchMaking}
          />
        )}
      </div>
      {message && <p>{message.message}</p>}
    </div>
  );
};

export default GameLobby;
