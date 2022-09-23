import React from 'react';
import './BrowseChannels.css';
import { Channel } from './entities';
import { Hashtable } from './entities';

export default function BrowseChannels({ allChannels, handleJoinChannel, ...props }: any) {
  return (
    <div className="row row-color">
      {Object.values(allChannels as Hashtable<Channel>).map((channel: Channel) => (
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
