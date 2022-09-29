import { FC, useCallback, useContext, useEffect, useState } from 'react';
import getFetch from '../../Components/Tools/getFetch';
import { SocketContext } from '../../socket';
import { useLocation } from 'react-router-dom';
import '../../Styles';
import { Link } from 'react-router-dom';
import { RootModalsContext } from '../RootModals/RootModalsProvider';

const FakeProfile: FC = (props: any) => {
  const socket = useContext(SocketContext);
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
  const [user, setUser] = useState({} as any);

  const [showModal, setShowModal] = useContext(RootModalsContext);

  /** *********************************************************************** */
  /** SOCKET EVENTS HANDLERS                                                  */
  /** *********************************************************************** */

  const handlePlayersInfo = useCallback((data: any) => {
    const player = data.players
      ? data.players.find((p: any) => p.id === id.toString())
      : {};
    setPlayer(player);
  }, []);

  /** *********************************************************************** */
  /** COMPONENT EVENTS HANDLERS                                               */
  /** *********************************************************************** */

  const handleChallengePlayer = () => {
    socket.emit('challengePlayer', { id: id });
  };

  /** *********************************************************************** */
  /** INITIALIZATION                                                          */
  /** *********************************************************************** */

  const getUserInfos = async () => {
    const request = `http://127.0.0.1:4200/users/${id}`;
    const user_json = await getFetch({ url: request });
    user_json.then((responseObject: any) => {
      setUser(responseObject);
    });
  };

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
    </div>
  );
};

export default FakeProfile;
