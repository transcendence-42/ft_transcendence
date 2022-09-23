import './CreateChannel.css';
import { useState } from 'react';
import React from 'react';
import { ChannelUser, CreateChannelDto } from './entities';
import { eChannelType, eChannelUserRole, eEvent } from './constants';

export default function CreateChannel({ userId, socket, ...props }: any) {
  const [channelName, setChannelName] = useState('');
  const [channelPassword, setChannelPassword] = useState('');
  const [channelType, setChannelType] = useState(eChannelType.Public);

  const handleCreateChannel = (e: any) => {
    e.preventDefault();
    if (channelName === '') return alert("channel name can't be empty");
    else if (channelType === eChannelType.Protected && channelPassword === '')
      return alert("Password can't be empty!");

    let users = [];
    const channelUser: ChannelUser = {
      id: userId,
      role: eChannelUserRole.Owner,
      isMuted: false,
      joinedChannelAt: 0,
    };
    users.push(channelUser);
    const payload: CreateChannelDto = {
      name: channelName,
      type: channelType,
      users,
      password: channelPassword
    };
    socket.emit(eEvent.CreateChannel, payload);
    setChannelName('');
    setChannelPassword('');
  };
  return (
    <>
      <form id="createChannelForm" className="form-label" onSubmit={handleCreateChannel}>
        <label className="form-label">Name</label>
        <input
          type="name"
          className="form-control form-control-margin"
          placeholder="# channel-name"
          onChange={(e) => setChannelName(e.target.value)}
          value={channelName}></input>
        <ul className="list-group">
          <select onChange={(e) => setChannelType(parseInt(e.target.value))}>
            <option value={eChannelType.Public}>Public</option>
            <option value={eChannelType.Private}>Private</option>
            <option selected value={eChannelType.Protected}>Protected</option>
          </select>
          <input
          onChange={(e) => setChannelPassword(e.target.value)}
          value={channelPassword}
            type="name"
            className="form-control form-control-margin"
            placeholder="Password"></input>
        </ul>
      </form>
    </>
  );
}
