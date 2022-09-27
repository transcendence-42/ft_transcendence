import React, { useState } from 'react';
import './BrowseChannels.css';
import { Channel } from './entities';
import { eChannelType } from './constants';

export default function BrowseChannels({ allChannels, ...props }: any) {
  const [channelSearch, setChannelSearch] = useState('');
  const [joinChannelPassword, setJoinChannelPassword] = useState('');
    allChannels = allChannels.filter((channel: Channel) => channel.type !== eChannelType.DIRECT);
  const handleJoinChannel = (e: any, channel: Channel) => {
    e.preventDefault();
    console.log(`This is the channel ${JSON.stringify(channel, null, 4)}`);
    if (!channel) {
      console.log(`Channel doesnt exist`);
      return;
    }
    if (channel['type'] === eChannelType.PROTECTED && joinChannelPassword === '') {
      return alert('You must provide a Password!');
    }
  };
  let filtered: Channel[];
  if (allChannels.length !== 0 && channelSearch) {
    filtered = allChannels.filter((channel: Channel) =>
      new RegExp(channelSearch, 'i').test(channel.name)
    );
  } else {
    filtered = allChannels;
  }

  return (
    <div className="row row-color">
      <input
        style={{ color: 'black' }}
        value={channelSearch}
        onChange={(e) => setChannelSearch(e.target.value)}></input>
      {filtered.length !== 0 &&
        filtered.map((channel: Channel) => (
          <div className="channels" key={channel.id}>
            <div className="col">
              <p>{channel.name}</p>
            </div>
            <div className="col">
              <button
                className="rounded-4 btn-pink btn-join"
                onClick={(e) => handleJoinChannel(e, channel)}>
                Join
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}
