import React from 'react';
import '../../Components/Tools/Text.css';
import '../../Components/Tools/Box.css';
import './profile.css';
import PhotoProfilDropdown from '../../Components/Tools/Button/PhotoProfilDropdown';
import OnlineOffline from './OnlineOffline';
import FriendshipRejected from './Button/FriendshipRejected';
import FriendshipAccepted from './Button/FriendshipAccepted';
import { Link } from 'react-router-dom';

const FriendList = (props: any) => {
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
  /** COMPONENT EVENT HANDLERS                                                */
  /** *********************************************************************** */

  const getPlayerFromId = (id: number) => {
    if (props.players !== undefined)
      return props.players.find((p: any) => p.id === id.toString());
    return null
  };

  /** *********************************************************************** */
  /** RENDER                                                                  */
  /** *********************************************************************** */

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <h3 className="text-pink text-start">Friends</h3>
      {
        <table className="table table-borderless scroll m-1 align-middle friends-list">
          <tbody>
            {props.friendRequestList &&
              props.id === props.originalId &&
              props.friendRequestList.map((friendship: any, index: number) => (
                <tr
                  className="border-blue"
                  key={index}
                  style={{ fontSize: '1.2em' }}
                >
                  {
                    <>
                      <td>
                        <PhotoProfilDropdown
                          url={friendship.requester.profilePicture}
                          id={friendship.requesterId}
                          originalId={props.originalId}
                          width={'50px'}
                          height={'50px'}
                        />
                      </td>
                      <td className="text-pink">
                        {friendship.requester.username}
                      </td>
                      <td>
                        <span className="badge badge-gold">New request</span>
                      </td>
                      <td></td>
                      <td>
                        <FriendshipAccepted
                          addresseeId={friendship.addresseeId}
                          requesterId={friendship.requesterId}
                          up={props.up}
                        />
                      </td>
                      <td>
                        <FriendshipRejected
                          addresseeId={friendship.addresseeId}
                          requesterId={friendship.requesterId}
                          up={props.up}
                        />
                      </td>
                    </>
                  }
                </tr>
              ))}
            {props.friendList ? (
              props.friendList.map((friend: any, index: number) => (
                <tr
                  className="border-blue"
                  key={index}
                  style={{ fontSize: '1.2em' }}
                >
                  {
                    <>
                      <td>
                        <PhotoProfilDropdown
                          url={friend.profilePicture}
                          id={friend.id}
                          originalId={props.originalId}
                          width={'50px'}
                          height={'50px'}
                        />
                      </td>
                      <td className="text-pink">{friend.username}</td>
                      <td>
                        <OnlineOffline
                          status={
                            props.players ? getPlayerFromId(friend.id).status : 0
                          }
                          size={'1em'}
                        />
                      </td>
                      <td></td>
                      <td></td>
                      {props.players &&
                        getPlayerFromId(friend.id).status ===
                          ePlayerStatus.ONLINE && (
                            <td>
                              <button
                                type="button"
                                className="btn btn-pink text-pink"
                                onClick={() => props.handleChallengePlayer(friend.id.toString())}
                              >
                                challenge
                              </button>
                            </td>
                        )}
                      {props.players &&
                        getPlayerFromId(friend.id).status ===
                          ePlayerStatus.PLAYING && (
                            <td>
                              <Link
                                to="/lobby"
                                state={{
                                  origin: {
                                    name: 'profile',
                                    loc: `/profile/${props.id}`,
                                    state: null,
                                  },
                                  gameId: getPlayerFromId(friend.id).game,
                                  action: eAction.SPECTATE,
                                }}
                                className="btn btn-pink text-pink"
                              >
                                Spectate
                              </Link>
                            </td>
                        )}
                      {props.players &&
                        getPlayerFromId(friend.id).status ===
                          ePlayerStatus.WAITING && (
                          <>
                            <td>
                              <Link
                                to="/lobby"
                                state={{
                                  origin: {
                                    name: 'profile',
                                    loc: `/profile/${props.id}`,
                                    state: null,
                                  },
                                  gameId: getPlayerFromId(friend.id).game,
                                  action: eAction.JOIN,
                                }}
                                className="btn btn-pink text-pink"
                              >
                                Join
                              </Link>
                            </td>
                            <td></td>
                          </>
                        )}
                      <td></td>
                      <td></td>
                    </>
                  }
                </tr>
              ))
            ) : 
            !props.friendRequestList && (
              <tr className="border-blue">
                <td
                  className="text-blue mt-3"
                  style={{ fontSize: '1.2em', width: '100%' }}
                >
                  New Friends awaits you ...
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            )}
          </tbody>
        </table>
      }
    </div>
  );
};

export default FriendList;
