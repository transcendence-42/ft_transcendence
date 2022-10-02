import React from "react";
import { eChannelType } from "../constants";
import { ChatUser, Friendship } from "../entities";
import "../../../Components/Tools/Text.css";
import "../../../Components/Tools/Box.css";
import "./FriendList.css";

export default function FriendList({
  userId,
  friends,
  setCreateDirectId,
  ...props
}: any) {
  console.log(`These are friends`);
  friends.map((friend: ChatUser) =>
    console.log(`${JSON.stringify(friend, null, 4)}`)
  );

  let test_friends = [
    {
      id: 2,
      username: "Flmastor",
      profilePicture: "https://cdn.intra.42.fr/users/flmastor.jpg",
      currentStatus: 0,
      eloRating: 0,
    },
    {
      id: 3,
      username: "Flal",
      profilePicture: "https://cdn.intra.42.fr/users/fmonbeig.jpg",
      currentStatus: 1,
      eloRating: 0,
    },
    {
      id: 1,
      username: "Johny",
      profilePicture: "https://cdn.intra.42.fr/users/fmonbeig.jpg",
      currentStatus: 0,
      eloRating: 0,
    },
  ];

  return (
    <div className="col">
      <>
        {test_friends.map((friend) => {
          return (

              <div key={friend.id} className="form-check">
                <input
                  onClick={(e) => setCreateDirectId(friend.id)}
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault1"
                ></input>
                <label
                  className="form-check-label textBlue"
                  htmlFor="flexRadioDefault1"
                >
                  {friend.username}
                </label>
              </div>
          );
        })}
      </>
    </div>
  );
}
//   {console.log(`Thi sis friend name ${friend.name}`)}
