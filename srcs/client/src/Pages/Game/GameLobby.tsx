// React
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
// Socket
import { GameSocketContext } from "./socket/socket";
// User Context
import { UserContext } from "../../Context/UserContext";
// Game
import Game from "./Game";
import GameList from "./GameList";
import PongModal from "../../Components/Modal/PongModal";
import { mapNeon } from "./conf/maps";
// Modals
import Matchmaking from "./modals/MatchMaking";
import MapSelect from "./modals/MapSelect";
import GoBack from "./modals/GoBack";
// Styles
import "./Game.css";
import "../../Styles";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import SelectOptions from "./modals/SelectOptions";

const GameLobby: FC = () => {
  /**
   * @locationState origin.name:  Name of the previous page
   *                origin.loc:   Location of the previous page to go back
   *                origin.state: State of the origin to restore it when go back
   *                gameId?:      Id of the game on which apply the action. Can
   *                              be '' if not needed.
   *                action?:      0: Do nothing | 1: Join | 2: Spectacte
   *
   * @props         userId:       id of the current user
   */

  /** *********************************************************************** */
  /** ENUMS                                                                   */
  /** *********************************************************************** */

  enum eAction {
    NOTHING = 0,
    JOIN,
    SPECTATE,
  }

  enum eEvents {
    GO_LOBBY = 0,
    VIEW_GAME,
    CREATE_GAME,
    JOIN_GAME,
    RECO_GAME,
  }

  enum eMatchMaking {
    NOT_IN_QUEUE = 0,
    IN_QUEUE,
    IN_GAME,
  }

  /** *********************************************************************** */
  /** GLOBAL                                                                  */
  /** *********************************************************************** */

  const navigate = useNavigate();
  const socket = useContext(GameSocketContext);
  // Get current user
  const { user: currentUser } = useContext<{user: { id: number }}>(UserContext);
  const userId = currentUser.id;

  /** *********************************************************************** */
  /** STATES                                                                  */
  /** *********************************************************************** */

  // Get a state from location provider
  const location: any = useLocation();
  let origin: { loc: string; name: string; state: any };
  let gameId: string;
  let action: number;
  if (location.state) {
    ({ origin, gameId, action } = location.state);
  } else {
    origin = { loc: "/lobby", name: "lobby", state: null };
    gameId = "";
    action = eAction.NOTHING;
  }

  // States
  const [game, setGame] = useState({ action: eEvents.GO_LOBBY, id: "lobby" });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [player, setPlayer] = useState({} as any);
  const [message, setMessage] = useState({} as any);
  const [gameList, setGameList] = useState([] as any);
  const [matchMaking, setMatchMaking] = useState(eMatchMaking.NOT_IN_QUEUE);
  const [gameMap, setGameMap] = useState(mapNeon);
  const [isEffect, setIsEffect] = useState(false);

  /** *********************************************************************** */
  /** MODAL                                                                   */
  /** *********************************************************************** */

  // Modal states
  const [showGoBack, setShowGoBack] = useState(false);
  const [showMatchMaking, setShowMatchMaking] = useState(false);
  const [showMapSelect, setShowMapSelect] = useState(false);
  const [showSelectOptions, setShowSelectOptions] = useState(false);

  // Modal event handlers
  const handleCloseGoBack = () => setShowGoBack(false);
  const handleShowGoBack = () => setShowGoBack(true);
  const handleCloseMatchMaking = () => setShowMatchMaking(false);
  const handleShowMatchMaking = () => setShowMatchMaking(true);
  const handleCloseMapSelect = () => setShowMapSelect(false);
  const handleShowMapSelect = () => setShowMapSelect(true);
  const handleCloseSelectOptions = () => setShowSelectOptions(false);
  const handleShowSelectOptions = () => setShowSelectOptions(true);

  /** *********************************************************************** */
  /** SOCKET EVENTS HANDLERS                                                  */
  /** *********************************************************************** */

  // Socket events handlers
  const handleGameList = useCallback((gameList: any) => {
    setGameList(gameList);
  }, []);

  const handleScoreUpdate = useCallback(
    (scoreData: any) => {
      const updatedGameList = gameList.map((g: any) => {
        if (g.id === scoreData.id) {
          return {
            ...g,
            players: scoreData.players,
          };
        } else {
          return g;
        }
      });
      setGameList(updatedGameList);
    },
    [gameList]
  );

  const handleGameId = useCallback(
    (data: any) => {
      setMessage({});
      setGame({ id: data.id, action: eEvents.CREATE_GAME });
      // Pop the option modal if the game is created from the lobby
      if (isEffect === true) {
        handleShowSelectOptions();
        setIsEffect(false);
      }
    },
    [eEvents.CREATE_GAME, isEffect]
  );

  const handleReconnect = useCallback(
    (gameId: any) => {
      setMessage({});
      setGame({ id: gameId, action: eEvents.RECO_GAME });
    },
    [eEvents.RECO_GAME]
  );

  const handleMatchMaking = useCallback(
    (value: eMatchMaking) => {
      socket.emit("matchMaking", { value: value });
    },
    [socket]
  );

  const handleOpponentFound = useCallback(() => {
    if (game.action === eEvents.VIEW_GAME) {
      socket.emit("viewerLeaves", { id: game.id });
    }
    handleShowMatchMaking();
    setTimeout(() => {
      handleCloseMatchMaking();
    }, 2000);
  }, [eEvents.VIEW_GAME, game, socket]);

  const handleInfo = useCallback((info: any) => {
    setMessage({ message: info.message });
    setTimeout(() => {
      setMessage({});
    }, 4000);
  }, []);

  const handlePlayersInfos = useCallback(
    (data: any) => {
      const player = data.players
        ? data.players.find((p: any) => p.id === userId.toString())
        : {};
      if (player) {
        setMatchMaking(player.matchmaking);
        setPlayer(player);
        // reconnect game if needed
        if (player.game && game.id === "lobby") {
          if (
            gameList &&
            gameList.some((g: any) => g.id === player.game) === true
          )
            setGame({ id: player.game, action: eEvents.JOIN_GAME });
        }
      }
    },
    [eEvents.JOIN_GAME, game.id, gameList, userId]
  );

  /** *********************************************************************** */
  /** COMPONENT EVENT HANDLERS                                                */
  /** *********************************************************************** */

  const handleNewGame = () => {
    setIsEffect(true);
    socket.emit("createGame");
  };

  const handleSetGame = (data: any) => {
    setGame(data);
  };

  const backToOrigin = () => {
    if (origin.name === "lobby") {
      socket.emit("findAllGame");
      setMessage({});
      setMatchMaking(eMatchMaking.NOT_IN_QUEUE);
      setGame({ id: "lobby", action: eEvents.GO_LOBBY });
    } else {
      navigate(origin.loc, { state: origin.state });
    }
  };

  const handleBackTo = () => {
    handleCloseGoBack();
    // Viewer : remove the viewer and change its room in the server
    if (game.action === eEvents.VIEW_GAME) {
      socket.emit("viewerLeaves", { id: game.id });
      backToOrigin();
    }
    // Player : cancel if 1 player / abandon if match started
    if (game.action !== eEvents.VIEW_GAME) {
      let wait: boolean = true;
      const isGame: any = gameList.find((g: any) => g.id === game.id);
      if (isGame && isGame.players && isGame.players.length === 1) wait = false;
      socket.emit("playerAbandons", { id: game.id });
      if (wait) {
        setTimeout(() => {
          backToOrigin();
        }, 2000);
      } else backToOrigin();
    }
  };

  /** *********************************************************************** */
  /** INITIALIZATION                                                          */
  /** *********************************************************************** */

  const init = useCallback(() => {
    // Check state action
    if (action === eAction.JOIN && gameId !== null) {
      setGame({ id: gameId, action: eEvents.JOIN_GAME });
    } else if (action === eAction.SPECTATE && gameId !== null) {
      setGame({ id: gameId, action: eEvents.VIEW_GAME });
    } else {
      setGame({ id: "lobby", action: eEvents.GO_LOBBY });
      socket.emit("findAllGame");
    }
    // Get players infos
    socket.emit("getPlayersInfos");
  }, [
    action,
    gameId,
    eAction.JOIN,
    eAction.SPECTATE,
    eEvents.GO_LOBBY,
    eEvents.JOIN_GAME,
    eEvents.VIEW_GAME,
    socket,
  ]);

  useEffect(() => {
    socket.on("opponentFound", handleOpponentFound);
    return () => {
      socket.off("opponentFound", handleOpponentFound);
    };
  }, [handleOpponentFound, socket]);

  useEffect(() => {
    socket.on("scoreUpdate", handleScoreUpdate);
    return () => {
      socket.off("scoreUpdate", handleScoreUpdate);
    };
  }, [gameList, handleScoreUpdate, socket]);

  useEffect(() => {
    socket.on("playersInfos", handlePlayersInfos);
    return () => {
      socket.off("playersInfos", handlePlayersInfos);
    };
  }, [handlePlayersInfos, socket]);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    // Socket listeners
    socket.on("gameList", handleGameList);
    socket.on("reconnect", handleReconnect);
    socket.on("gameId", handleGameId);
    socket.on("exception", handleInfo);
    socket.on("info", handleInfo);
    return () => {
      socket.off("gameList", handleGameList);
      socket.off("reconnect", handleReconnect);
      socket.off("gameId", handleGameId);
      socket.off("exception", handleInfo);
      socket.off("info", handleInfo);
    };
  }, [handleGameId, handleGameList, handleInfo, handleReconnect, socket]);

  /** *********************************************************************** */
  /** RENDER                                                                  */
  /** *********************************************************************** */

  return (
    <>
      {/* Modals */}
      <PongModal
        title={`Go back to ${origin.name}`}
        closeHandler={handleCloseGoBack}
        show={showGoBack}
        textBtn1="Cancel"
        handleBtn1={handleCloseGoBack}
        textBtn2={`Go back to ${origin.name}`}
        handleBtn2={handleBackTo}
      >
        <GoBack />
      </PongModal>
      <PongModal
        title="Matchmaking"
        closeHandler={handleCloseMatchMaking}
        show={showMatchMaking}
      >
        <Matchmaking />
      </PongModal>
      <PongModal
        title="Select map"
        closeHandler={handleCloseMapSelect}
        show={showMapSelect}
      >
        <MapSelect
          closeHandler={handleCloseMapSelect}
          setGameMap={setGameMap}
        />
      </PongModal>
      <PongModal
        title="Select game options"
        closeHandler={handleCloseSelectOptions}
        show={showSelectOptions}
      >
        <SelectOptions
          closeHandler={handleCloseSelectOptions}
          socket={socket}
          gameId={game?.id}
        />
      </PongModal>

      {/* Action buttons */}
      <div id="game-actions" className="row">
        <div className="col-xs-1 col-md-2"></div>
        <div className="col-xs-10 col-md-8">
          <button
            type="button"
            className="btn btn-blue text-blue me-2 mb-4"
            onClick={handleShowMapSelect}
          >
            <PaletteOutlinedIcon />
          </button>
          {game && game.action === eEvents.GO_LOBBY && (
            <button
              type="button"
              className="btn btn-blue text-blue me-2 mb-4"
              onClick={handleNewGame}
            >
              Create New Game
            </button>
          )}
          {game && game.action === eEvents.VIEW_GAME && (
            <button
              type="button"
              className="btn btn-blue text-blue me-2 mb-4"
              onClick={handleBackTo}
            >
              Go back to {origin.name}
            </button>
          )}
          {game && game.action > eEvents.VIEW_GAME && (
            <button
              className="btn btn-blue text-blue me-2 mb-4"
              onClick={handleShowGoBack}
            >
              Go back to {origin.name}
            </button>
          )}
          {matchMaking === eMatchMaking.NOT_IN_QUEUE ? (
            <button
              className="btn btn-pink text-pink mb-4"
              style={{ cursor: "pointer" }}
              onClick={() => handleMatchMaking(eMatchMaking.IN_QUEUE)}
            >
              Join queue
            </button>
          ) : (
            matchMaking === eMatchMaking.IN_QUEUE && (
              <button
                className="btn btn-pink text-pink mb-4"
                style={{ cursor: "pointer" }}
                onClick={() => handleMatchMaking(eMatchMaking.NOT_IN_QUEUE)}
              >
                <span
                  className="spinner-grow spinner-grow-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span> looking for an opponent...</span>
              </button>
            )
          )}
        </div>
        <div className="col-xs-1 col-md-2"></div>
      </div>

      {/* Content : game list or game screen*/}
      <div id="game-content" className="row">
        <div className="col-xs-1 col-md-2"></div>
        {game && game.action === eEvents.GO_LOBBY && (
          <div className="col-xs-10 col-md-8">
            <GameList
              gameList={gameList}
              setGame={handleSetGame}
              handleNewGame={handleNewGame}
              event={eEvents}
              userId={ userId ? userId.toString() : undefined}
              handleInfo={handleInfo}
            />
          </div>
        )}
        {game && game.action > eEvents.GO_LOBBY && (
          <div id="stage" className="col-xs-10 col-md-8">
            <Game
              socket={socket}
              id={game.id}
              action={game.action}
              event={eEvents}
              origin={origin.name}
              backToOrigin={backToOrigin}
              setMatchMaking={setMatchMaking}
              matchMakingVal={eMatchMaking}
              className="translate-middle"
              map={gameMap}
            />
          </div>
        )}
        <div className="col-xs-1 col-md-2"></div>
      </div>

      {/* Information messages */}
      <div id="game-messages" className="row">
        <div className="col-xs-6 col-md-3"></div>
        <div className="col-xs-6 col-md-6">
          {message && message !== "" && (
            <div className="blueText">{message.message}</div>
          )}
        </div>
        <div className="col-xs-6 col-md-3"></div>
      </div>
    </>
  );
};

export default GameLobby;
