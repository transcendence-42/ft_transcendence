import React from 'react';
import '../../Components/Tools/Text.css';
import '../../Components/Tools/Box.css';
import './profile.css';
import PhotoProfilDropdown from '../../Components/Tools/Button/PhotoProfilDropdown';
import OnlineOffline from './OnlineOffline';
import FriendshipRejected from './Button/FriendshipRejected';
import FriendshipAccepted from './Button/FriendshipAccepted';

const FriendList = (props: any) => {
  return (
    <div
      className="blueBoxFriend"
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <div className="yellowText" style={{ fontSize: '3vw' }}>
        Friends
      </div>
      {
        <table className="table scroll m-1 align-middle  ">
          <tbody>
            {props.friendRequestList &&
              props.friendRequestList.map((friendship: any, index: number) => (
                <tr key={index} style={{ fontSize: '2vw' }}>
                  {
                    <>
                      <td className="pinkText"> New </td>
                      <td>
                        <PhotoProfilDropdown
                          url={friendship.requester.profilePicture}
                          id={friendship.requesterId}
                          originalId={props.originalId}
                          width={'4vw'}
                          height={'4vw'}
                        />
                      </td>
                      <td> {friendship.requester.username} </td>
                      <td colSpan={2}>
                        <table>
                          <tbody>
                            <tr>
                              <td>
                                <FriendshipAccepted
                                  addresseeId={friendship.addresseeId}
                                  requesterId={friendship.requesterId}
                                  up={props.up}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <FriendshipRejected
                                  addresseeId={friendship.addresseeId}
                                  requesterId={friendship.requesterId}
                                  up={props.up}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </>
                  }
                </tr>
              ))}
            {props.friendList ? (
              props.friendList.map((friend: any, index: number) => (
                <tr key={index} style={{ fontSize: '2vw' }}>
                  {
                    <>
                      <td>
                        <PhotoProfilDropdown
                          url={friend.profilePicture}
                          id={friend.id}
                          originalId={props.originalId}
                          width={'4vw'}
                          height={'4vw'}
                        />
                      </td>
                      <td> {friend.username} </td>
                      <td>
                        <OnlineOffline // Change here
                          status={friend.currentStatus}
                          size={'2vw'}
                        />
                      </td>
                    </>
                  }
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="blueTextMatch"
                  style={{ fontSize: '2vw', marginTop: '3vh' }}
                >
                  New Friends awaits you
                </td>
              </tr>
            )}
          </tbody>
        </table>
      }
    </div>
  );
}

export default FriendList;
