import { User } from "./entities/user.entity";
import "./FriendList.css";

export default function FriendList({
  userId,
  friends,
  createDirect,
  ...props
}: any) {
  console.log(`These are friends`);
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
              <div className="col">
                {friend.username}
              </div>
            </div>
          );
        })}
      </>
    </div>
  );
}
