import { useCallback, useEffect, useRef, useState } from 'react';
import Canvas from '../../Components/Canvas/Canvas';

const Game = (props: any) => {
  // Enum
  enum movement {
    UP = 0,
    DOWN,
  }

  const enum Motive {
    WIN = 0,
    LOSE,
    ABANDON,
    CANCEL,
  }

  const socket = props.socket;
  // States
  const [grid, setGrid] = useState({} as any);
  const [scores, setScores] = useState([]);
  const [message, setMessage] = useState('');
  const timer = useRef({} as NodeJS.Timer);

  // Init
  const initGame = () => {
    if (props.action === props.actionVal.JOIN_GAME) {
      socket.emit('joinGame', { id: props.id });
      props.setMatchMaking(props.matchMakingVal.IN_GAME);
    } else if (props.action === props.actionVal.VIEW_GAME)
      socket.emit('viewGame', { id: props.id });
    else if (props.action === props.actionVal.RECO_GAME)
      socket.emit('reconnectGame', { id: props.id });
    socket.emit('getGameGrid', { id: props.id });
  };

  // Handlers
  const handleMove = (event: any) => {
    if (event.key === 'w' || event.key === 'W') {
      socket.emit('updateGame', { move: movement.UP, id: props.id });
    }
    else if (event.key === 's' || event.key === 'S') {
      socket.emit('updateGame', { move: movement.DOWN, id: props.id });
    }
    else if (event.key === 'p' || event.key === 'P') {
      socket.emit('pause', { id: props.id });
    }
  };

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
      if (motive === Motive.WIN)
        setMessage('The game is over. Moving back to lobby');
      else if (motive === Motive.ABANDON)
        setMessage('One player abandoned. Moving back to lobby');
      else if (motive === Motive.CANCEL)
        setMessage('Player canceled the game. Moving back to lobby');
      setTimeout(() => {
        props.backTo({ id: 'lobby', action: props.actionVal.GO_LOBBY });
      }, 4000);
    },
    [props, Motive.WIN, Motive.ABANDON, Motive.CANCEL, timer],
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
      }, 1000)
    }, [timer]
  );

  useEffect(() => {
    initGame();
    socket.on('updateGrid', handleGridUpdate);
    socket.on('updateScores', handleScoresUpdate);
    socket.on('gameEnd', handleGameEnd);
    socket.on('pause', handlePause);
    if (props.action !== props.actionVal.VIEW_GAME)
      document.addEventListener('keydown', handleMove);
    return () => {
      socket.off('updateGrid', handleGridUpdate);
      socket.off('updateScores', handleScoresUpdate);
      socket.off('gameEnd', handleGameEnd);
      socket.off('pause', handlePause);
      document.removeEventListener('keydown', handleMove);
    };
  }, [props.action]);

  return (
    <Canvas grid={grid} scores={scores} message={message} map={props.map} />
  );
};

export default Game;
