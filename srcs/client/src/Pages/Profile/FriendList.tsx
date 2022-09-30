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
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <h3 className="text-pink text-start">Friends</h3>
      {
        <table className="table table-borderless scroll m-1 align-middle">
          <tbody>
            {props.friendRequestList &&
              props.friendRequestList.map((friendship: any, index: number) => (
                <tr
                  className="border-blue w-100"
                  key={index}
                  style={{ fontSize: '2vw' }}
                >
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
                      <td className="text-pink">
                        {friendship.requester.username}
                      </td>
                      <td>
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
                <tr
                  className="border-blue w-100"
                  key={index}
                  style={{ fontSize: '2vw' }}
                >
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
                      <td className="text-pink">{friend.username}</td>
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
              <tr className='border-blue'>
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
};

export default FriendList;
