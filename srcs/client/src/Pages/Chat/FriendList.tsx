import { Friendship, User } from "./entities/user.entity";
import "./FriendList.css";

export default function FriendList({
  userId,
  friends,
  setCreateDirectId,
  ...props
}: any) {
  console.log(`These are friends`);
  friends.map((friend: User) =>
    console.log(`${JSON.stringify(friend, null, 4)}`)
  );

  return (
    <div className="col">
      <>
        {friends.map((friend: User) => {
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
                className="form-check-label friend-color"
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
