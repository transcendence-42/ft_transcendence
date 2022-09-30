// React
import React, { useCallback, useContext } from 'react';
import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
// Style
import './profile.css';
import '../../Components/Tools/Text.css';
import '../../Components/Tools/Box.css';
import '../../Styles/';
// Components
import AddFriend from './Button/AddFriend';
import BlockFriend from './Button/BlockFriend';
import PhotoProfil from '../../Components/Tools/Button/PhotoProfil';
import OnlineOffline from './OnlineOffline';
import ChangePseudo from './Button/ChangePseudo';
import ChangePicture from './Button/ChangePicture';
import DoubleAuth from './Button/DoubleAuth';
import Ladder from './Ladder';
import MatchHistory from './MatchHistory';
import FriendList from './FriendList';
// Utils
import { getFetch } from './Fetch/getFetch';
import { getFetchMatch } from './Fetch/getFetchMatch';
import { getFetchFriends } from './Fetch/getFetchFriends';
// Context
import { SocketContext } from '../Game/socket/socket';

const Profile = () => {
  /**
   * @locationState userId:  id of the user whose profile we are looking at.
   */

  /** *********************************************************************** */
  /** GLOBAL                                                                  */
  /** *********************************************************************** */

  const location = useLocation();
  const [socket, originalId] = useContext(SocketContext);
  let { id } = useParams();
  let userId: number;
  if (id) userId = +id;
  else userId = +originalId;

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

  const [user, setUser] = useState({} as any);
  const [player, setPlayer] = useState({} as any);
  const [friendList, setFriendList] = useState([] as any);
  const [friendRequestList, setFriendRequestList] = useState([] as any);
  const [matchesList, setMatchesList] = useState([] as any);
  const [update, setUpdate] = useState(2);

  /** *********************************************************************** */
  /** SOCKET EVENTS HANDLERS                                                  */
  /** *********************************************************************** */

  const handlePlayersInfo = useCallback((data: any) => {
    // current player status
    const player = data.players
      ? data.players.find((p: any) => p.id === userId.toString())
      : {};
    setPlayer(player);
    if (player.updated === 1) {
      setUpdate(1);
    }
  }, []);

  /** *********************************************************************** */
  /** COMPONENT EVENT HANDLERS                                                */
  /** *********************************************************************** */

  function toggleUpdate() {
    setTimeout(() => {
      if (update === 2) setUpdate(1);
      if (update === 1) setUpdate(0);
      if (update === 0) setUpdate(1);
    }, 100);
  }

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

  useEffect(() => {
    if (userId) {
      let request = 'http://127.0.0.1:4200/users/' + userId;
      const user_json = getFetch({ url: request });
      user_json.then((responseObject) => {
        setUser(responseObject);
      });
      request = 'http://127.0.0.1:4200/users/' + userId + '/friends';
      const friend_json = getFetchFriends({ url: request });
      friend_json.then((responseObject) => {
        setFriendList(responseObject);
      });
      request = 'http://127.0.0.1:4200/users/' + userId + '/friendrequests';
      const friendRequests_json = getFetchFriends({ url: request });
      friendRequests_json.then((responseObject) => {
        setFriendRequestList(responseObject);
      });
      request = 'http://127.0.0.1:4200/users/' + userId + '/matches';
      const matches_json = getFetchMatch({ url: request });
      matches_json.then((responseObject) => {
        setMatchesList(responseObject);
      });
    }
  }, [userId, update]);

  /** *********************************************************************** */
  /** RENDER                                                                  */
  /** *********************************************************************** */

  if (user) {
    return (
      <div className='row'>
        <div className='col-md-2'></div>
        <div className='col-xs-12 col-md-8'>

          {/* Profil picture + action buttons + stats */}
          <div className="row mt-5" data-testid="tracker">
            <div className="col-xs-12 col-md-2">
              <PhotoProfil
                url={user.profilePicture}
                width={'100px'}
                height={'100px'}
              />
            </div>
            <div className="col-xs-2 col-md-2">
              <div
                className="text-pink text-center"
                style={{ fontSize: '1.3em', fontWeight: 'bold' }}
              >
                {user.username}
              </div>
              <OnlineOffline status={+player.status} size={'1.2em'} />
            </div>
            <div className="col-xs-2 col-md-2">
              {userId === +originalId ? (
                <>
                  <ChangePseudo id={userId} up={toggleUpdate} />
                  <ChangePicture id={userId} up={toggleUpdate} />
                  <DoubleAuth />
                </>
              ) : (
                <>
                  <AddFriend id={userId} originalId={+originalId} />
                  <BlockFriend id={userId} originalId={+originalId} />
                </>
              )}
            </div>
            <div className="col-xs-6 col-md-6">
              <Ladder stats={user.stats} elo={user.eloRating} />
            </div>
          </div>

          {/* Match history + friends */}
          <div className="row">
            <div className="col-xs-12 col-md-6">
              <MatchHistory
                matchesList={matchesList}
                id={+userId}
              />
            </div>
            <div className="col-xs-12 col-md-6">
              <FriendList
                friendList={friendList}
                friendRequestList={friendRequestList}
                id={userId}
                originalId={+originalId}
                up={toggleUpdate}
              />
            </div>
          </div>
        </div>
        <div className='col-md-2'></div>
      </div>
    );
  }
  return <></>;
};

export default Profile;
