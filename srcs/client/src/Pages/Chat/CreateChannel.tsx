import './CreateChannel.css';
import { useState } from 'react';
import React from 'react';
import { ChannelUser, CreateChannelDto } from './entities';
import { Events } from './events';
//  <form style={{ margin: '15px ' }} onSubmit={handleCreateChannel}>
//       <div style={{ color: 'white' }}> Create a Channel</div>
//       <input
//         className="createChannel"
//         onChange={(e) => setCreateChannelName(e.target.value)}
//         value={createChannelName}
//       />
//       <select onChange={(e) => setChannelType(e.target.value)}>
//         <option value="public">Public</option>
//         <option value="private">Private</option>
//         <option value="protected">Protected</option>
//       </select>
//       <div style={{ color: 'white' }}>Set a password for your channel</div>
//       <input
//         className="createChannelPassword"
//         onChange={(e) => setCreateChannelPassword(e.target.value)}
//         value={createChannelPassword}
//       />
//       <div style={{ color: 'white' }}>Add a friend to your channel</div>
//       <input
//         className="createChannelFriends"
//         onChange={(e) => setCreateChannelFriends(e.target.value)}
//         value={createChannelFriends}
//       />
//       <button className="createChanneButton" type="submit">
//         Create Channel
//       </button>
//     </form>
export default function CreateChannel({ userId, socket, ...props }: any) {
  const [channelName, setChannelName] = useState('');
  const [channelPassword, setChannelPassword] = useState('');
  const [channelType, setChannelType] = useState('public');

  const handleCreateChannel = (e: any) => {
    e.preventDefault();
    if (channelName === '') return alert("channel name can't be empty");
    else if (channelType === 'protected' && channelPassword === '')
      return alert("Password can't be empty!");

    let users = [];
    const channelUser: ChannelUser = {
      id: userId,
      role: 'owner'
    };
    users.push(channelUser);
    const payload: CreateChannelDto = {
      name: channelName,
      type: channelType,
      users,
      password: channelPassword
    };
    socket.emit(Events.createChannel, payload);
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
          <select onChange={(e) => setChannelType(e.target.value)}>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="protected">Protected</option>
          </select>
          <input
            type="name"
            className="form-control form-control-margin"
            placeholder="Password"></input>
        </ul>
      </form>
    </>
  );
}
