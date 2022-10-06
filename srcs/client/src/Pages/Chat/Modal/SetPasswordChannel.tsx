import React from "react";
import { Channel, User, UserOnChannel } from "../entities/user.entity";
import "../../../Components/Tools/Text.css";
import "../../../Components/Tools/Box.css";
import "./FriendList.css";

export default function SetPasswordChannel({
  userId,
  friends,
  channel,
  addToChannel,
  allChannels,
  ...props
}: any)

const [newChannelPassword, setNewChannelPassword] = useState("");

  const handlePasswordOperation = () => {
    console.log(
      `Changing password for channel ${currentChannel.id} with password ${newChannelPassword}`
    );
    if (!newChannelPassword) {
      return alert("Password cant be empty!");
    }
    if (currentChannel.type === eChannelType.DIRECT) {
      changeChannelPassword(currentChannel.id, newChannelPassword);
    } else {
      setChannelPassword(currentChannel.id, newChannelPassword);
    }
    setNewChannelPassword("");
  };

  return (
      <>
        <button
        onClick={(e) => handlePasswordOperation()}
        style={{ fontSize: "12px" }}
        className="col btn btn-leave me-2"
      >
        <div className="textPink ">Password</div>
      </button>
      <input
        onChange={(e) => setNewChannelPassword(e.target.value)}
        placeholder="channel Pass"
      ></input>
      </>
  );
}
