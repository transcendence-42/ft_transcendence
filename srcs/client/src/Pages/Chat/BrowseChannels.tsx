import React, { useState } from "react";
import "./BrowseChannels.css";
import { Channel, UserOnChannel } from "./entities";
import { eChannelType } from "./constants";
import { fetchUrl } from "./utils";

export default function BrowseChannels({
  allChannels,
  setAllChannels,
  userChannels,
  ...props
}: any) {
  const [channelSearch, setChannelSearch] = useState("");
  const [joinChannelPassword, setJoinChannelPassword] = useState("");
  allChannels = allChannels.filter(
    (channel: Channel) => channel.type !== eChannelType.DIRECT
  );
  const getRelevantChannels = async () => {
    const channels = await fetchUrl("http://127.0.0.1:4200/channel/", "GET");
    console.log(`all channels in brose == `);
    if (channels && channels.length > 0) {
      setAllChannels(channels);
      // all the public and protected channels and all private channels where you are
      // get all channels
      // pass user.channels in props

      return channels.filter((channel: Channel) => {
        console.log(`Channel ${JSON.stringify(channel, null, 4)}`);
        if (channel.type === eChannelType.DIRECT) return;
        if (channel.type === eChannelType.PRIVATE) {
          // does the user belong to the protected channel ?
          if (
            !userChannels?.find(
              (userChannel: UserOnChannel) =>
                userChannel.channelId === channel.id
            )
          ) {
            return;
          }
        }
        return channel;
      });
    }
  };

  allChannels = getRelevantChannels();
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
  let filtered: Channel[];
  if (allChannels.length !== 0 && channelSearch) {
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
