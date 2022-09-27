import React, { useState } from 'react';
import './BrowseChannels.css';
import { Channel } from './entities';
import { Hashtable } from './entities';

export default function BrowseChannels({ allChannels, handleJoinChannel, ...props }: any) {
  const [channelSearch, setChannelSearch] = useState('');
  let filtered: Channel[];
  if (channelSearch) {
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
      {filtered.map((channel: Channel) => (
        <div className="channels" key={channel.id}>
          <div className="col">
            <p>{channel.name}</p>
          </div>
          <div className="col">
            <button
              className="rounded-4 btn-pink btn-join"
              onClick={(e) => handleJoinChannel(e, channel.id)}>
              Join
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
