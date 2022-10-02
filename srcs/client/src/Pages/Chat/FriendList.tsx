import { User } from "./entities/user.entity";
import "./FriendList.css";

export default function FriendList({
  userId,
  friends,
  createDirect,
  ...props
}: any) {
  console.log(`These are friends`);
  friends.map((friend: User) =>
    console.log(`these are friends ${JSON.stringify(friend)}`)
  );

  return (
    <div className="col">
      <>
        {friends.map((friend: User) => {
          return (
            <div
              onClick={(e) => createDirect(e, friend.id)}
              key={friend.id}
              className="btn rounded-4 btn-pink btn-switch"
            >
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
