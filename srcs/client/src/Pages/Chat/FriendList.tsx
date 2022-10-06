import { User } from "./entities/user.entity";
import "./FriendList.css";

export default function FriendList({
  userId,
  friends,
  createDirect,
  userChannels,
  ...props
}: any) {
  console.group(`These are friends`);
  console.log(`${JSON.stringify(friends)}`);
  console.log(`these are user on channels ${JSON.stringify(userChannels)}`);
  console.groupEnd();
  return (
    <div className="col">
      <>
        {friends.map((friend: User) => {
          if (
            userChannels?.find(
              (usrOnChan) =>
                usrOnChan.channelId === userId + "_" + friend.id ||
                usrOnChan.channelId === friend.id + "_" + userId
            )
          )
            return "";
          return (
            <div
              onClick={(e) => createDirect(e, friend.id)}
              key={friend.id}
              className="btn rounded-4 btn-pink btn-switch"
            >
              <div className="col">{friend.username}</div>
            </div>
          );
        })}
      </>
    </div>
  );
}
