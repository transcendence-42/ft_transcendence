// React
import React, { useCallback, useContext } from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// Style
import './profile.css';
import '../../Components/Tools/Text.css';
import '../../Components/Tools/Box.css';
import '../../Styles/';
// Components
import AddFriend from './Button/AddFriend';
import PhotoProfil from '../../Components/Tools/Button/PhotoProfil';
import OnlineOffline from './OnlineOffline';
import ChangePicture from './Button/ChangePicture';
import DoubleAuth from './Button/DoubleAuth';
import Ladder from './Ladder';
import ChangeUsername from './Button/ChangeUsername';
// Utils
import { getFetch } from './Fetch/getFetch';
import { getFetchMatch } from './Fetch/getFetchMatch';
import { getFetchFriends } from './Fetch/getFetchFriends';
// Context
import { SocketContext } from '../Game/socket/socket';
import PaginatedMatchHistory from './PaginatedMatchHistory';
import PaginatedFriendList from './PaginatedFriendList';

const Profile = () => {
  /**
   * @locationState userId:  id of the user whose profile we are looking at.
   */

  /** *********************************************************************** */
  /** GLOBAL                                                                  */
  /** *********************************************************************** */

  // Get game socket
  const [socket, originalId] = useContext(SocketContext);
  // Get user id from params
  let { id } = useParams();
  // Handle id errors
  let userId: number;
  if (id) {
    userId = +id;
  } else userId = 0;

  /** *********************************************************************** */
  /** STATES                                                                  */
  /** *********************************************************************** */

  const [user, setUser] = useState({} as any);
  const [doubleFactor, setDoubleFactor]: any = useState(false);
  const [player, setPlayer] = useState({} as any);
  const [players, setPlayers] = useState([] as any);
  const [friendList, setFriendList] = useState([] as any);
  const [friendRequestList, setFriendRequestList] = useState([] as any);
  const [matchesList, setMatchesList] = useState([] as any);
  const [update, setUpdate] = useState(2);

  /** *********************************************************************** */
  /** SOCKET EVENTS HANDLERS                                                  */
  /** *********************************************************************** */

  const handlePlayersInfo = useCallback((data: any) => {
    // all players
    setPlayers(data.players);
    // current player status
    const player = data.players
      ? data.players.find((p: any) => p.id === userId.toString())
      : {};
    setPlayer(player);
    if (player && player.updated === 1) {
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

  const handleChallengePlayer = (id: string) => {
    socket.emit('challengePlayer', { id: id });
  };

  const handleSwitchStatus = () => {
    socket.emit('switchStatus');
  };

  /** *********************************************************************** */
  /** INITIALIZATION                                                          */
  /** *********************************************************************** */

  useEffect(() => {
    socket.emit('getPlayersInfos');
    socket.on('playersInfos', handlePlayersInfo);
    return () => {
      socket.off('playersInfos', handlePlayersInfo);
    };
  }, [id]);

  useEffect(() => {
    if (userId) {
      // One first check
      let request = 'http://127.0.0.1:4200/users/' + userId;
      const user_json = getFetch({ url: request });
      user_json.then((responseObject) => {
        if (responseObject.statusCode && responseObject.statusCode === 404) {
          setUser(null);
        } else {
          setUser(responseObject);
          // All user queries if user exists
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
          request = 'http://127.0.0.1:4200/auth/2fa/state/' + userId;
          const double_json = getFetch({ url: request });
          double_json.then((responseObject) => {
            if (responseObject) {
              setDoubleFactor(true);
            }
          });
        }
      });
    } else setUser(null);
  }, [userId, update]);

  /** *********************************************************************** */
  /** RENDER                                                                  */
  /** *********************************************************************** */

  if (user) {
    return (
      <div className="row">
        <div className="col-xl-1"></div>
        <div className="col-xs-12 col-xl-10">
          {/* Profil picture + action buttons + stats */}
          <div className="row mt-5 mb-5" data-testid="tracker">
            <div className="col-xs-8 col-md-2 col-xl-2">
              <PhotoProfil
                url={user.profilePicture}
                width={'100px'}
                height={'100px'}
              />
            </div>
            <div className="col-xs-8 col-md-2 col-xl-2">
              <div
                className="text-blue text-center"
                style={{ fontSize: '1.3em', fontWeight: 'bold' }}
              >
                {user.username}
              </div>
              <OnlineOffline
                status={+player?.status}
                size={'1.2em'}
                userId={userId}
                currentId={originalId}
                switchHandler={handleSwitchStatus}
                displaySwitch={true}
              />
            </div>
            <div className="col-xs-8 col-md-3 col-xl-2 mb-2">
              {userId === +originalId ? (
                <>
                  <ChangeUsername id={userId} up={toggleUpdate} />
                  <ChangePicture id={userId} up={toggleUpdate} />
                  <DoubleAuth
                    id={userId}
                    up={toggleUpdate}
                    authUp={setDoubleFactor}
                    activated={doubleFactor}
                  />
                </>
              ) : (
                <AddFriend id={userId} originalId={+originalId} />
              )}
            </div>
            <div className="col-xs-12 col-md-5 col-xl-6">
              <Ladder stats={user.stats} elo={user.eloRating} />
            </div>
          </div>

          {/* Match history + friends */}
          <div className="row">
            <div className="col-xs-12 col-xl-6 d-flex flex-column">
              <PaginatedMatchHistory
                items={matchesList}
                itemsPerPage={5}
                userId={userId}
              />
            </div>
            <div className="col-xs-12 col-xl-6">
              <PaginatedFriendList
                items={friendList}
                friendRequestList={friendRequestList}
                itemsPerPage={5}
                id={userId}
                originalId={+originalId}
                up={toggleUpdate}
                players={players}
                handleChallengePlayer={handleChallengePlayer}
              />
            </div>
          </div>
        </div>
        <div className="col-xl-1"></div>
      </div>
    );
  } else {
    return (
      <div className="row text-center">
        <div className="col text-pink fs-2">User #{id} not found</div>
      </div>
    );
  }
};

export default Profile;
