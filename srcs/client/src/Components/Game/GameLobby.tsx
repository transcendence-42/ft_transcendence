import { useCallback, useContext, useEffect, useState } from "react";
import { SocketContext } from "../../socket";
import GameList from "./GameList";
import Game from "./Game";
import "../../Components/Tools/Box.css"
import "../../Components/Tools/Text.css"
import './Game.css'
import Modal from "./Modal";

const GameLobby = () => {
  // Enums
  enum Action {
    GO_LOBBY = 0,
    VIEW_GAME,
    CREATE_GAME,
    JOIN_GAME,
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

  const handleBackToLobby = () => {
    // hide modal
    const modal = document.getElementById('gameModal');
    modal?.classList.remove('show')
    modal?.setAttribute('aria-hidden', 'true');
    const backdrop = document.getElementsByClassName('modal-backdrop');
    document.body.removeChild(backdrop[0]);
    // Viewer : remove the viewer and change its room in the server
    if (game.action === Action.VIEW_GAME) {
      socket.emit("viewerLeaves", { id: game.id });
      backToLobby({ id: "lobby", action: Action.GO_LOBBY });
    }
    // Player : cancel if 1 player / abandon if match started
    if (game.action !== Action.VIEW_GAME) {
      socket.emit("playerAbandons", { id: game.id });
      backToLobby({ id: "lobby", action: Action.GO_LOBBY });
    }
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
    <>
     <Modal handleBackToLobby={handleBackToLobby} />
      <div id="actions" className="row mb-4">
        <div className="col-xs-6 col-md-3"></div>
        <div className="col-xs-6 col-md-6">
          {game && game.action === Action.GO_LOBBY &&
            <button type="button" className="btn btn-blue text-blue" onClick={handleNewGame}>
              Create New Game
            </button>}
          {game && game.action === Action.VIEW_GAME &&
            <button type="button" className="btn btn-blue text-blue" onClick={handleBackToLobby}>
              Go back to lobby
            </button>}
          {game && game.action > Action.VIEW_GAME &&
            <button className="btn btn-blue text-blue" data-bs-toggle="modal" data-bs-target="#gameModal">
              Go back to lobby
            </button>}
          {matchMaking === MatchMaking.NOT_IN_QUEUE ? (
            <button className="btn btn-pink text-pink m-3" style={{ cursor: "pointer" }}
              onClick={() => handleMatchMaking(MatchMaking.IN_QUEUE)}>
              Join queue
            </button>
          ) : (
            matchMaking === MatchMaking.IN_QUEUE && (
              <button className="btn btn-pink text-pink m-3" style={{ cursor: "pointer" }}
                onClick={() => handleMatchMaking(MatchMaking.NOT_IN_QUEUE)}
              >
                We are looking for an opponent ... (click to Cancel)
              </button>
            )
          )}
        </div>
        <div className="col-xs-6 col-md-3"></div>
      </div>
      <div id="content" className="row">
        <div className="col-xs-6 col-md-3"></div>
          {game && game.action === Action.GO_LOBBY && (
            <div className="col-xs-6 col-md-6">
              <GameList
                gameList={gameList}
                setGame={setGame}
                handleNewGame={handleNewGame}
                actionVal={Action} />
            </div>
          )}
          {game && game.action > Action.GO_LOBBY && (
            <div className="col-xs-6 col-md-6">
              <Game
                socket={socket}
                id={game.id}
                action={game.action}
                backToLobby={backToLobby}
                actionVal={Action}
                setMatchMaking={setMatchMaking}
                matchMakingVal={MatchMaking} className="translate-middle" />
            </div>
          )}
        
        <div className="col-xs-6 col-md-3"></div>
      </div>
      <div className="row">
        <div className="col-xs-6 col-md-3"></div>
        <div className="col-xs-6 col-md-6">
        {message && message !== '' &&
          <div className="blueText">{message.message}</div>
        }
        </div>
        <div className="col-xs-6 col-md-3"></div>
      </div>
    </>
  );
};

export default GameLobby;
