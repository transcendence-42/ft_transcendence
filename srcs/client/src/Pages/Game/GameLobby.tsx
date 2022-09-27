// React
import { useCallback, useContext, useEffect, useState } from 'react';
// Socket
import { SocketContext } from '../../socket';
// Game
import Game from './Game';
import GameList from './GameList';
import PongModal from '../../Components/Modal/PongModal';
import { mapNeon } from './conf/maps';
// Styles
import './Game.css';
import '../../Styles';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import Matchmaking from './modals/MatchMaking';
import MapSelect from './modals/MapSelect';
import GoBack from './modals/GoBack';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const GameLobby = (props: any) => {
  /** 
   * @props origin.name:  Name of the previous page
   *        origin.loc:   Location of the previous page to go back
   *        gameId?:      Id of the game on which apply the action. Can be ''.
   *        action?:      0: Do nothing | 1: Join | 2: Spectacte
   */

  // Enums
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

  // const location: any = useLocation();
  // const { origin, gameId, action } = location.state;

  const navigate = useNavigate();
  const socket = useContext(SocketContext);

  // States
  const [game, setGame] = useState({ action: eEvents.GO_LOBBY, id: 'lobby' });
  const [message, setMessage] = useState({} as any);
  const [gameList, setGameList] = useState([] as any);
  const [matchMaking, setMatchMaking] = useState(eMatchMaking.NOT_IN_QUEUE);
  const [gameMap, setGameMap] = useState(mapNeon);

  // Modal states
  const [showGoBack, setShowGoBack] = useState(false);
  const [showMatchMaking, setShowMatchMaking] = useState(false);
  const [showMapSelect, setShowMapSelect] = useState(false);

  // Modal event handlers
  const handleCloseGoBack = () => setShowGoBack(false);
  const handleShowGoBack = () => setShowGoBack(true);
  const handleCloseMatchMaking = () => setShowMatchMaking(false);
  const handleShowMatchMaking = () => setShowMatchMaking(true);
  const handleCloseMapSelect = () => setShowMapSelect(false);
  const handleShowMapSelect = () => setShowMapSelect(true);

  // Socket events handlers
  const handleGameList = useCallback((gameList: any) => {
    setGameList(gameList);
  }, []);

  const handleScoreUpdate = useCallback((scoreData: any) => {
    const updatedGameList = gameList.map((g: any) => {
      if (g.id === scoreData.id) {
        return ({
          ...g,
          players: scoreData.players,
        })
      } else {
        return g;
      }
    })
    setGameList(updatedGameList);
  }, [gameList]);

  const handleGameId = useCallback(
    (data: any) => {
      setMessage({});
      setGame({ id: data.id, action: eEvents.CREATE_GAME });
    },
    [eEvents.CREATE_GAME],
  );

  const handleReconnect = useCallback(
    (gameId: any) => {
      setMessage({});
      setGame({ id: gameId, action: eEvents.RECO_GAME });
    },
    [eEvents.RECO_GAME],
  );

  const handleMatchMaking = useCallback(
    (value: eMatchMaking) => {
      setMatchMaking(value);
      socket.emit('matchMaking', { value: value });
    },
    [socket],
  );

  const handleOpponentFound = useCallback(() => {
    console.log('action : ' + game.action + 'id: ' + game.id);
    if (game.action === eEvents.VIEW_GAME) {
      socket.emit('viewerLeaves', { id: game.id });
    }
    handleShowMatchMaking();
    setTimeout(() => {
      handleCloseMatchMaking();
      setMatchMaking(eMatchMaking.IN_GAME);
    }, 2000);
  }, [eMatchMaking.IN_GAME, eEvents.VIEW_GAME, game, socket]);

  const handleInfo = useCallback((info: any) => {
    setMessage({ message: info.message });
    setTimeout(() => {
      setMessage({});
    }, 4000);
  }, []);

  // component event handlers
  const handleNewGame = () => {
    setMatchMaking(eMatchMaking.IN_GAME);
    socket.emit('createGame');
  };

  const backTo = (room: any) => {
    socket.emit('findAllGame');
    setMessage({});
    setMatchMaking(eMatchMaking.NOT_IN_QUEUE);
    setGame(room);
  };

  const handleBackTo = () => {
    handleCloseGoBack();
    // Viewer : remove the viewer and change its room in the server
    if (game.action === eEvents.VIEW_GAME) {
      socket.emit('viewerLeaves', { id: game.id });
      if (props.origin.name !== 'lobby')
        navigate(props.origin.loc);
      else backTo({ id: 'lobby', action: eEvents.GO_LOBBY });
    }
    // Player : cancel if 1 player / abandon if match started
    if (game.action !== eEvents.VIEW_GAME) {
      socket.emit('playerAbandons', { id: game.id });
      
      backTo({ id: 'lobby', action: eEvents.GO_LOBBY });
    }
  };

  const init = () => {
    setGame({ action: eEvents.GO_LOBBY, id: 'lobby' });
    socket.emit('findAllGame');
  };

  useEffect(() => {
    socket.on('opponentFound', handleOpponentFound);
     return () => {
      socket.off('opponentFound', handleOpponentFound);
    }
  }, [handleOpponentFound]);

  useEffect(() => {
    socket.on('scoreUpdate', handleScoreUpdate);
    return () => {
      socket.off('scoreUpdate', handleScoreUpdate);
    };
  }, [gameList]);

  useEffect(() => {
    init();
    // Socket listeners
    socket.on('gameList', handleGameList);
    socket.on('reconnect', handleReconnect);
    socket.on('gameId', handleGameId);
    socket.on('exception', handleInfo);

    socket.on('info', handleInfo);
    // get all games
    socket.emit('findAllGame');
    return () => {
      socket.off('gameList', handleGameList);
      socket.off('reconnect', handleReconnect);
      socket.off('gameId', handleGameId);
      socket.off('exception', handleInfo);

      socket.off('info', handleInfo);
    };
  }, []);

  // Render
  return (
    <>
      {/* Modals */}
      <PongModal
        title={`Go back to ${props.origin.name}`}
        closeHandler={handleCloseGoBack}
        show={showGoBack}
        textBtn1="Cancel"
        handleBtn1={handleCloseGoBack}
        textBtn2={`Go back to ${props.origin.name}`}
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

      {/* Action buttons */}
      <div id="game-actions" className="row">
        <div className="col-xs-6 col-md-3"></div>
        <div className="col-xs-6 col-md-6">
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
              Go back to {props.origin.name}
            </button>
          )}
          {game && game.action > eEvents.VIEW_GAME && (
            <button
              className="btn btn-blue text-blue me-2 mb-4"
              onClick={handleShowGoBack}
            >
              Go back to {props.origin.name} 
            </button>
          )}
          {matchMaking === eMatchMaking.NOT_IN_QUEUE ? (
            <button
              className="btn btn-pink text-pink mb-4"
              style={{ cursor: 'pointer' }}
              onClick={() => handleMatchMaking(eMatchMaking.IN_QUEUE)}
            >
              Join queue
            </button>
          ) : (
            matchMaking === eMatchMaking.IN_QUEUE && (
              <button
                className="btn btn-pink text-pink mb-4"
                style={{ cursor: 'pointer' }}
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
        <div className="col-xs-6 col-md-3"></div>
      </div>

      {/* Content : game list or game screen*/}
      <div id="game-content" className="row">
        <div className="col-xs-6 col-md-3"></div>
        {game && game.action === eEvents.GO_LOBBY && (
          <div className="col-xs-6 col-md-6">
            <GameList
              gameList={gameList}
              setGame={setGame}
              handleNewGame={handleNewGame}
              event={eEvents}
            />
          </div>
        )}
        {game && game.action > eEvents.GO_LOBBY && (
          <div id="stage" className="col-xs-6 col-md-6">
            <Game
              socket={socket}
              id={game.id}
              action={game.action}
              event={eEvents}
              backTo={backTo}
              setMatchMaking={setMatchMaking}
              matchMakingVal={eMatchMaking}
              className="translate-middle"
              map={gameMap}
            />
          </div>
        )}
        <div className="col-xs-6 col-md-3"></div>
      </div>

      {/* Information messages */}
      <div id="game-messages" className="row">
        <div className="col-xs-6 col-md-3"></div>
        <div className="col-xs-6 col-md-6">
          {message && message !== '' && (
            <div className="blueText">{message.message}</div>
          )}
        </div>
        <div className="col-xs-6 col-md-3"></div>
      </div>
    </>
  );
};

export default GameLobby;
