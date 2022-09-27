import React from 'react';
import { eChannelType } from './constants';
import { ChatUser, Friendship } from './entities';
import './FriendList.css';

export default function FriendList({
  userId,
  friends,
  handleAddToChannel,
  handleCreateChannel,
  ...props
}: any) {
  console.log(`These are friends`);
  friends.map((friend: ChatUser) => console.log(`${JSON.stringify(friend, null, 4)}`));
  const createDirect = async (e: any, friendId: number) => {
    const channelName = friendId.toString() + '_' + userId.toString();
    const channelId = await handleCreateChannel(
      e,
      channelName,
      eChannelType.DIRECT,
      userId
    );
    if (channelId) handleAddToChannel(friendId, channelId);
    else return alert(`couldnt create channel with user ${friendId}`);
  };
  return (
    <div className="col">
      <>
        {friends.map((friend: ChatUser) => {
          return (
            <button
              onClick={(e) => createDirect(e, friend.id)}
              className="rounded-4 btn-pink btn-join"
              key={friend.id}>
              {friend.username}
            </button>
          );
        })}
      </>
    </div>
  );
}
//   {console.log(`Thi sis friend name ${friend.name}`)}
