import { FC, useCallback, useContext, useEffect, useState } from 'react';
import { SocketContext } from '../Game/socket/socket';
import { useLocation } from 'react-router-dom';
import '../../Styles';
import { Link } from 'react-router-dom';

const FakeProfile: FC = (props: any) => {
  const [socket, userId] = useContext(SocketContext);
  const location: any = useLocation();
  const { id } = location.state;

  /** *********************************************************************** */
  /** ENUMS                                                                   */
  /** *********************************************************************** */

  enum ePlayerStatus {
    OFFLINE = 0,
    ONLINE,
    WAITING,
    PLAYING,
    SPECTATING,
    CHALLENGE,
  }

  enum eAction {
    NOTHING = 0,
    JOIN,
    SPECTATE,
  }

  /** *********************************************************************** */
  /** STATES                                                                  */
  /** *********************************************************************** */

  const [player, setPlayer] = useState({} as any);
  const [userStatus, setUserStatus] = useState(0);

  /** *********************************************************************** */
  /** SOCKET EVENTS HANDLERS                                                  */
  /** *********************************************************************** */

  const handlePlayersInfo = useCallback((data: any) => {
    // current player status
    const player = data.players
      ? data.players.find((p: any) => p.id === id.toString())
      : {};
    setPlayer(player);
    // if current player is looking its own profile
    if (player.id === userId)
      setUserStatus(player.status)
  }, []);

  /** *********************************************************************** */
  /** COMPONENT EVENTS HANDLERS                                               */
  /** *********************************************************************** */

  const handleChallengePlayer = () => {
    socket.emit('challengePlayer', { id: id });
  };

  const handleSwitchStatus = () => {
    socket.emit('switchStatus');
  };

  /** *********************************************************************** */
  /** INITIALIZATION                                                          */
  /** *********************************************************************** */

  const init = async () => {
    socket.emit('getPlayersInfos');
  };

  useEffect(() => {
    init();
    socket.on('playersInfos', handlePlayersInfo);
    return () => {
      socket.off('playersInfos', handlePlayersInfo);
    };
  }, []);

  /** *********************************************************************** */
  /** RENDER                                                                  */
  /** *********************************************************************** */

  return (
    <div>
      <h1 className="text-pink">Fake profile page</h1>
      {player && player.status !== undefined ? (
        <h4 className="text-blue">
          {player.status === ePlayerStatus.OFFLINE && `player is offline`}
          {player.status === ePlayerStatus.CHALLENGE &&
            `player is challenging or being challenged`}
          {player.status === ePlayerStatus.ONLINE && (
            <>
              player is online
              <button
                onClick={handleChallengePlayer}
                className="btn btn-pink text-pink"
              >
                Challenge
              </button>
            </>
          )}
          {player.status === ePlayerStatus.SPECTATING &&
            `player is spectating a game`}
          {player.status === ePlayerStatus.WAITING && (
            <>
              player is waiting for an opponent
              <Link
                to="/lobby"
                state={{
                  origin: {
                    name: 'profile',
                    loc: '/prof',
                    state: location.state,
                  },
                  gameId: player.game,
                  action: eAction.JOIN,
                }}
                className="btn btn-pink text-pink"
              >
                Join
              </Link>
            </>
          )}
          {player.status === ePlayerStatus.PLAYING && (
            <>
              player is playing a game
              <Link
                to="/lobby"
                state={{
                  origin: {
                    name: 'profile',
                    loc: '/prof',
                    state: location.state,
                  },
                  gameId: player.game,
                  action: eAction.SPECTATE,
                }}
                className="btn btn-pink text-pink"
              >
                Spectate
              </Link>
            </>
          )}
        </h4>
      ) : (
        <h4 className="text-blue">waiting for status update</h4>
      )}
      {
        id !== userId
        ? userStatus === ePlayerStatus.ONLINE
          ? <button className='btn btn-pink text-pink' onClick={handleSwitchStatus}>Go offline</button>
          : <button className='btn btn-pink text-pink' onClick={handleSwitchStatus}>Go back online</button>
        :<></>
      }
    </div>
  );
};

export default FakeProfile;
