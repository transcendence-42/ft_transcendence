import React, { useState } from "react";
import "./BrowseChannels.css";
import { Channel, UserOnChannel } from "./entities";
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

    const userAlreadyInChannel: UserOnChannel | null = userChannels.find(
      (userOnChannel: UserOnChannel) => userOnChannel.channelId === channel.id
    );
    if (userAlreadyInChannel) {
      const bannedDate = new Date(
        userAlreadyInChannel.bannedTill
      ).getMilliseconds();
      if (bannedDate < Date.now()) {
        return alert(`You are banned till ${bannedDate.toLocaleString()}!`);
      }
      const mutedDate = new Date(
        userAlreadyInChannel.mutedTill
      ).getMilliseconds();
      if (mutedDate < Date.now()) {
        alert(
          `Welcome to the channel! Remember that you are muted till ${mutedDate.toLocaleString()}`
        );
      }
    }

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

  const nonDirectChannels = allChannels?.filter(
    (channel: Channel) => channel.type !== eChannelType.DIRECT
  );
  // all the public and protected channels and all private channels where you are
  // get all channels
  // pass user.channels in props

  const availableChannels = nonDirectChannels?.filter((channel: Channel) => {
    console.log(`Channel ${JSON.stringify(channel, null, 4)}`);
    if (channel.type === eChannelType.DIRECT) return;
    if (channel.type === eChannelType.PRIVATE) {
      // does the user belong to the protected channel ?
      if (
        !userChannels?.find(
          (userChannel: UserOnChannel) => userChannel.channelId === channel.id
        )
      ) {
        return;
      }
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
      {filtered.length > 0 ? (
        <>
          <input
            style={{ color: "black" }}
            value={channelSearch}
            onChange={(e) => setChannelSearch(e.target.value)}
          ></input>
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
