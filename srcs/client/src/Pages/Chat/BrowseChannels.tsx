import { useState } from "react";
import "./BrowseChannels.css";
import { Channel, UserOnChannel } from "./entities/user.entity";
import { eChannelType } from "./constants";

export default function BrowseChannels({
  allChannels,
  userChannels,
  userId,
  ...props
}: any) {
  const [channelSearch, setChannelSearch] = useState("");
  const [joinChannelPassword, setJoinChannelPassword] = useState("");
  const handleJoinChannel = (e: any, channel: Channel) => {
    e.preventDefault();

    console.log(`This is the channel ${JSON.stringify(channel, null, 4)}`);
    if (!channel) {
      console.log(`Channel doesnt exist`);
      return;
    }
    if (
      channel["type"] === eChannelType.PROTECTED &&
      joinChannelPassword === ""
    ) {
      return alert("You must provide a Password!");
    }
  };

  // all the public and protected channels and all private channels where you are
  // get all channels
  // pass user.channels in props

  const availableChannels = allChannels?.filter((channel: Channel) => {
    if (
      channel.type === eChannelType.DIRECT ||
      channel.type === eChannelType.PRIVATE
    )
      return;
    // don't show channels where the user is banned
    // if (channel.bannedUsersId.find((id) => id === userId)) {
    // return;
    // }
    // does the user belong to the private channel ?
    const userInChan: UserOnChannel = userChannels?.find(
      (usrChan: UserOnChannel) => usrChan.channelId === channel.id
    );
    // if user is not in channel then show the channel
    // if the user is in channel:
    // user is banned ? don't show
    // user has left channel but not banned ? show
    if (userInChan) {
      const now = Date.now();
      // const bannedDate = new Date(userInChan.bannedTill).getMilliseconds();
      // if (bannedDate < now) return;
    }
    return channel;
  });

  let filtered: Channel[];
  if (availableChannels.length !== 0 && channelSearch) {
    filtered = allChannels.filter((channel: Channel) =>
      new RegExp(channelSearch, "i").test(channel.name)
    );
  } else {
    filtered = allChannels;
  }

  return (
    <div className="row row-color">
      <input
        style={{ color: "black" }}
        value={channelSearch}
        onChange={(e) => setChannelSearch(e.target.value)}
      ></input>
      {filtered.length > 0 ? (
        <>
          {filtered.length !== 0 &&
            filtered.map((channel: Channel) => (
              <div className="channels" key={channel.id}>
                <div className="col">
                  <p>{channel.name}</p>
                </div>
                <div className="col">
                  <button
                    className="btn rounded-4 btn-pink btn-join"
                    onClick={(e) => handleJoinChannel(e, channel)}
                  >
                    Join
                  </button>
                </div>
              </div>
            ))}{" "}
        </>
      ) : (
        ""
      )}
    </div>
  );
}
