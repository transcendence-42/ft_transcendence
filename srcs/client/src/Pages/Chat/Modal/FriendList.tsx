import React from "react";
import { User } from "../entities/user.entity";
import "../../../Components/Tools/Text.css";
import "../../../Components/Tools/Box.css";
import "./FriendList.css";

export default function FriendList({
  userId,
  friends,
  createDirect,
  userChannels,
  ...props
}: any) {
  return (
    <div className="col">
      <>
        {friends.map((friend: User) => {
          if (
            userChannels?.find(
              (usrOnChan) =>
                usrOnChan.channel.name ===
                  userId.toString() + "_" + friend.id.toString() ||
                usrOnChan.channel.name ===
                  friend.id.toString() + "_" + userId.toString()
            )
          )
            return "";
          return (
            <div
              onClick={(e) => createDirect(e, friend.id)}
              key={friend.id}
              className="btn rounded-4 btn-pink btn-switch textPink m-1"
            >
              <div className="col">{friend.username}</div>
            </div>
          );
        })}
      </>
    </div>
  );
}
