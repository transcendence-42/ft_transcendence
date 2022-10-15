import React from "react";
import { Channel, User, UserOnChannel } from "../entities/user.entity";
import "../../../Components/Tools/Text.css";
import "../../../Components/Tools/Box.css";
import "./FriendList.css";

const isInsideChannel = (channelId, userId, allChannels) => {
  const channel = allChannels.find((chan) => chan.id === channelId);
  if (!channel) {
    return false;
  } else if (
    channel.users.find(
      (usrOnChan: UserOnChannel) => usrOnChan.userId === userId
    )
  ) {
    return true;
  }
  return false;
};

//when user is banned can we add them ?
//when they are banned or muted and they left the channel should we handle this
//on the backend or the frontend ?
//I think handling this on the frontend would be better

export default function addFriendToChannel({
  userId,
  friends,
  channel,
  addToChannel,
  allChannels,
  ...props
}: any) {
  return (
    <div className="col">
      <>
        {friends.map((friend) => {
          if (isInsideChannel(channel.id, friend.id, allChannels)) {
            return "";
          }
          return (
            <div
              onClick={(e) => addToChannel(friend.id, channel.id)}
              key={friend.id}
              className="btn rounded-4 btn-pink btn-switch textPink m-1"
            >
              {friend.username}
            </div>
          );
        })}
      </>
    </div>
  );
}
