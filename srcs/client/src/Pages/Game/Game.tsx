import { useCallback, useEffect, useRef, useState } from 'react';
import Canvas from '../../Components/Canvas/Canvas';

const Game = ({
  socket,
  id,
  action,
  event,
  origin,
  backToOrigin,
  setMatchMaking,
  matchMakingVal,
  map,
}: any) => {
  /**
   * @props socket          : the game socket of the current player
            id              : game id
            action          : action regarding the game id (join, create, ...)
            event           : event enum regarding the game
            origin          : object with origin information
            backToOrigin    : handler to go back to origin location
            setMatchMaking  : handler to set matchmaking to true or false
            matchMakingVal  : enum for matchmaking statuses
            map             : selected map
   */

  /** *********************************************************************** */
  /** ENUMS                                                                   */
  /** *********************************************************************** */

  enum eMovement {
    UP = 0,
    DOWN,
  }

  enum eMotive {
    WIN = 0,
    LOSE,
    ABANDON,
    CANCEL,
  }

  /** *********************************************************************** */
  /** STATES                                                                  */
  /** *********************************************************************** */

  const [grid, setGrid] = useState({} as any);
  const [scores, setScores] = useState([]);
  const [message, setMessage] = useState('');
  const timer = useRef({} as NodeJS.Timer);

  /** *********************************************************************** */
  /** COMPONENT EVENT HANDLERS                                                */
  /** *********************************************************************** */

  const handleMove = useCallback(
    (event: any) => {
      if (event.key === 'w' || event.key === 'W') {
        socket.emit('updateGame', { move: eMovement.UP, id: id });
      } else if (event.key === 's' || event.key === 'S') {
        socket.emit('updateGame', { move: eMovement.DOWN, id: id });
      } else if (event.key === 'p' || event.key === 'P') {
        socket.emit('pause', { id: id });
      } else if (event.key === 'c' || event.key === 'C') {
        socket.emit('continue', { id: id });
      }
    },
    [eMovement.DOWN, eMovement.UP, id, socket],
  );

  /** *********************************************************************** */
  /** SOCKET EVENTS HANDLERS                                                  */
  /** *********************************************************************** */

  const handleGridUpdate = useCallback((gridUpdate: any) => {
    setGrid(gridUpdate);
  }, []);

  const handleScoresUpdate = useCallback((scoreUpdate: any) => {
    // if one player only, set message
    if (scoreUpdate.length === 1) setMessage('Waiting for an opponent ...');
    else setMessage('');
    setScores(scoreUpdate);
  }, []);

  const handleGameEnd = useCallback(
    (motive: number) => {
      if (timer.current) {
        clearInterval(timer.current);
      }
      if (motive === eMotive.WIN)
        setMessage(`The game is over. Moving back to ${origin}`);
      else if (motive === eMotive.ABANDON)
        setMessage(`One player abandoned. Moving back to ${origin}`);
      else if (motive === eMotive.CANCEL)
        setMessage(`Game canceled. Moving back to ${origin}`);
      setTimeout(() => {
        backToOrigin();
      }, 4000);
    },
    [eMotive.WIN, eMotive.ABANDON, eMotive.CANCEL, origin, backToOrigin],
  );

  const handlePause = useCallback(
    (duration: number) => {
      setMessage(`The game is paused : ${duration}s`);
      timer.current = setInterval(() => {
        --duration;
        setMessage(`The game is paused : ${duration}s`);
        if (duration <= 0) {
          clearInterval(timer.current);
          setMessage('');
        }
      }, 1000);
    },
    [timer],
  );

  /** *********************************************************************** */
  /** INITIALIZATION                                                          */
  /** *********************************************************************** */

  const initGame = useCallback(() => {
    if (action === event.JOIN_GAME) {
      socket.emit('joinGame', { id: id });
      setMatchMaking(matchMakingVal.IN_GAME);
    } else if (action === event.VIEW_GAME) socket.emit('viewGame', { id: id });
    socket.emit('getGameGrid', { id: id });
  }, [
    action,
    event.JOIN_GAME,
    event.VIEW_GAME,
    id,
    matchMakingVal.IN_GAME,
    setMatchMaking,
    socket,
  ]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    socket.on('updateGrid', handleGridUpdate);
    socket.on('updateScores', handleScoresUpdate);
    socket.on('gameEnd', handleGameEnd);
    socket.on('pause', handlePause);
    return () => {
      socket.off('updateGrid', handleGridUpdate);
      socket.off('updateScores', handleScoresUpdate);
      socket.off('gameEnd', handleGameEnd);
      socket.off('pause', handlePause);
    };
  }, [
    handleGameEnd,
    handleGridUpdate,
    handlePause,
    handleScoresUpdate,
    socket,
  ]);

  useEffect(() => {
    if (action !== event.VIEW_GAME) {
      document.addEventListener('keydown', handleMove);
      return () => {
        document.removeEventListener('keydown', handleMove);
      };
    }
  }, [handleMove, action, event.VIEW_GAME]);

  /** *********************************************************************** */
  /** RENDER                                                                  */
  /** *********************************************************************** */

  return <Canvas grid={grid} scores={scores} message={message} map={map} />;
};

export default Game;
