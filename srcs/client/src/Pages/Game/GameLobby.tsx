// React
import { useCallback, useContext, useEffect, useState } from 'react';
// Socket
import { SocketContext } from '../../socket';
// Game
import Game from './Game';
import GameList from './GameList';
import PongModal from '../../Components/Modal/PongModal';
import { mapNeon, mapOriginal } from './conf/maps';
// Styles
import './Game.css';
import '../../Styles';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';

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

  const socket = useContext(SocketContext);

  // States
  const [game, setGame] = useState({ action: Action.GO_LOBBY, id: 'lobby' });
  const [message, setMessage] = useState({} as any);
  const [gameList, setGameList] = useState([] as any);
  const [matchMaking, setMatchMaking] = useState(MatchMaking.NOT_IN_QUEUE);
  const [gameMap, setGameMap] = useState(mapNeon);

  // Modal states
  const [showGoBackLobby, setShowGoBackLobby] = useState(false);
  const [showMatchMaking, setShowMatchMaking] = useState(false);
  const [showMapSelect, setShowMapSelect] = useState(false);

  // Modal event handlers
  const handleCloseGoBackLobby = () => setShowGoBackLobby(false);
  const handleShowGoBackLobby = () => setShowGoBackLobby(true);
  const handleCloseMatchMaking = () => setShowMatchMaking(false);
  const handleShowMatchMaking = () => setShowMatchMaking(true);
  const handleCloseMapSelect = () => setShowMapSelect(false);
  const handleShowMapSelect = () => setShowMapSelect(true);

  // Socket events handlers
  const handleConnect = useCallback(() => {
    setGame({ action: Action.GO_LOBBY, id: 'lobby' });
    socket.emit('findAllGame');
  }, [socket, Action]);

  const handleGameList = useCallback((gameList: any) => {
    setGameList(gameList);
  }, []);

  const handleGameId = useCallback(
    (data: any) => {
      setMessage({});
      setGame({ id: data.id, action: Action.CREATE_GAME });
    },
    [Action.CREATE_GAME],
  );

  const handleException = useCallback((data: any) => {
    setMessage({ message: data.message });
  }, []);

  const handleReconnect = useCallback(
    (gameId: any) => {
      setMessage({});
      setGame({ id: gameId, action: Action.RECO_GAME });
    },
    [Action.RECO_GAME],
  );

  const handleMatchMaking = useCallback(
    (value: MatchMaking) => {
      setMatchMaking(value);
      socket.emit('matchMaking', { value: true });
    },
    [socket],
  );

  const handleOpponentFound = useCallback(() => {
    console.log('action : ' + game.action + 'id: ' + game.id);
    if (game.action === Action.VIEW_GAME) {
      socket.emit('viewerLeaves', { id: game.id });
    }
    handleShowMatchMaking();
    setTimeout(() => {
      handleCloseMatchMaking();
      setMatchMaking(MatchMaking.IN_GAME);
    }, 2000);
  }, [MatchMaking.IN_GAME, Action.VIEW_GAME, game, socket]);

  const handleInfo = useCallback((info: any) => {
    setMessage({ message: info.message });
    setTimeout(() => {
      setMessage({});
    }, 4000);
  }, []);

  // component event handlers
  const handleNewGame = () => {
    setMatchMaking(MatchMaking.IN_GAME);
    socket.emit('createGame');
  };

  const backToLobby = (room: any) => {
    socket.emit('findAllGame');
    setMessage({});
    setMatchMaking(MatchMaking.NOT_IN_QUEUE);
    setGame(room);
  };

  const handleBackToLobby = () => {
    handleCloseGoBackLobby();
    // Viewer : remove the viewer and change its room in the server
    if (game.action === Action.VIEW_GAME) {
      socket.emit('viewerLeaves', { id: game.id });
      backToLobby({ id: 'lobby', action: Action.GO_LOBBY });
    }
    // Player : cancel if 1 player / abandon if match started
    if (game.action !== Action.VIEW_GAME) {
      socket.emit('playerAbandons', { id: game.id });
      backToLobby({ id: 'lobby', action: Action.GO_LOBBY });
    }
  };

  useEffect(() => {
    // Socket listeners
    socket.on('connect', handleConnect);
    socket.on('gameList', handleGameList);
    socket.on('reconnect', handleReconnect);
    socket.on('gameId', handleGameId);
    socket.on('exception', handleException);
    socket.on('opponentFound', handleOpponentFound);
    socket.on('info', handleInfo);
    // get all games
    socket.emit('findAllGame');
    return () => {
      socket.off('connect', handleConnect);
      socket.off('gameList', handleGameList);
      socket.off('reconnect', handleReconnect);
      socket.off('gameId', handleGameId);
      socket.off('exception', handleException);
      socket.off('opponentFound', handleOpponentFound);
      socket.off('info', handleInfo);
    };
  }, [handleOpponentFound]);

  // Render
  return (
    <>
      <PongModal
        title="Go back to lobby"
        mainText="Warning: Do you confirm ?"
        subText="This action will cause you to lose the game if started, or cancel it if not started."
        closeHandler={handleCloseGoBackLobby}
        show={showGoBackLobby}
        textBtn1="Cancel"
        handleBtn1={handleCloseGoBackLobby}
        textBtn2="Go back to lobby"
        handleBtn2={handleBackToLobby}
      />
      <PongModal
        title="Matchmaking"
        mainText="An opponent has been found !"
        subText="The game will automatically start in few seconds ..."
        closeHandler={handleCloseMatchMaking}
        show={showMatchMaking}
      />
      <PongModal
        title="Select map"
        closeHandler={handleCloseMapSelect}
        show={showMapSelect}
        size="lg"
        select={[
          {
            img: '/img/neon.jpg',
            alt: 'neon',
            map: mapNeon,
            handler: setGameMap,
          },
          {
            img: '/img/original.jpg',
            alt: 'original',
            map: mapOriginal,
            handler: setGameMap,
          },
        ]}
      />
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
          {game && game.action === Action.GO_LOBBY && (
            <button
              type="button"
              className="btn btn-blue text-blue me-2 mb-4"
              onClick={handleNewGame}
            >
              Create New Game
            </button>
          )}
          {game && game.action === Action.VIEW_GAME && (
            <button
              type="button"
              className="btn btn-blue text-blue me-2 mb-4"
              onClick={handleBackToLobby}
            >
              Go back to lobby
            </button>
          )}
          {game && game.action > Action.VIEW_GAME && (
            <button
              className="btn btn-blue text-blue me-2 mb-4"
              onClick={handleShowGoBackLobby}
            >
              Go back to lobby
            </button>
          )}
          {matchMaking === MatchMaking.NOT_IN_QUEUE ? (
            <button
              className="btn btn-pink text-pink mb-4"
              style={{ cursor: 'pointer' }}
              onClick={() => handleMatchMaking(MatchMaking.IN_QUEUE)}
            >
              Join queue
            </button>
          ) : (
            matchMaking === MatchMaking.IN_QUEUE && (
              <button
                className="btn btn-pink text-pink mb-4"
                style={{ cursor: 'pointer' }}
                onClick={() => handleMatchMaking(MatchMaking.NOT_IN_QUEUE)}
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
      <div id="game-content" className="row">
        <div className="col-xs-6 col-md-3"></div>
        {game && game.action === Action.GO_LOBBY && (
          <div className="col-xs-6 col-md-6">
            <GameList
              gameList={gameList}
              setGame={setGame}
              handleNewGame={handleNewGame}
              actionVal={Action}
            />
          </div>
        )}
        {game && game.action > Action.GO_LOBBY && (
          <div id="stage" className="col-xs-6 col-md-6">
            <Game
              socket={socket}
              id={game.id}
              action={game.action}
              backToLobby={backToLobby}
              actionVal={Action}
              setMatchMaking={setMatchMaking}
              matchMakingVal={MatchMaking}
              className="translate-middle"
              map={gameMap}
            />
          </div>
        )}

        <div className="col-xs-6 col-md-3"></div>
      </div>
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
