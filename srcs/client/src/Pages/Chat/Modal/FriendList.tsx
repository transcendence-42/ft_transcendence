import React from "react";
import { User } from "../entities/user.entity";
import "../../../Components/Tools/Text.css";
import "../../../Components/Tools/Box.css";
import "./FriendList.css";

export default function FriendList({
  userId,
  friends,
  createDirect,
  ...props
}: any) {
  console.log(`These are friends`);
  friends.map((friend: User) =>
    console.log(`${JSON.stringify(friend, null, 4)}`)
  );

  // let test = {

  // }

  return (
    <div className="col">
      <>
        {friends.map((friend) => {
          return (
            <div
              onClick={(e) => createDirect(e, friend.id)}
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
//   {console.log(`Thi sis friend name ${friend.name}`)}
