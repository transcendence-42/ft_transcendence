import './CreateChannel.css';
import React from 'react';
import { useState } from 'react';
import { ChannelUser, CreateChannelDto } from './entities';
import { Events } from './events';
//  <form style={{ margin: '15px ' }} onSubmit={handleCreateChannel}>
//       <div style={{ color: 'white' }}> Create a Channel</div>
//       <input
//         className="createChannel"
//         onclick={(e) => setCreateChannelName(e.target.value)}
//         value={createChannelName}
//       />
//       <select onclick={(e) => setChannelType(e.target.value)}>
//         <option value="public">Public</option>
//         <option value="private">Private</option>
//         <option value="protected">Protected</option>
//       </select>
//       <div style={{ color: 'white' }}>Set a password for your channel</div>
//       <input
//         className="createChannelPassword"
//         onclick={(e) => setCreateChannelPassword(e.target.value)}
//         value={createChannelPassword}
//       />
//       <div style={{ color: 'white' }}>Add a friend to your channel</div>
//       <input
//         className="createChannelFriends"
//         onclick={(e) => setCreateChannelFriends(e.target.value)}
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
    // <> Noufel code with select
    //   <form id="createChannelForm" className="form-label" onSubmit={handleCreateChannel}>
    //     <label className="form-label">Name</label>
    //     <input
    //       type="name"
    //       className="form-control form-control-margin"
    //       placeholder="# channel-name"
    //       onclick={(e) => setChannelName(e.target.value)}
    //       value={channelName}>
    //     </input>
    //     <ul className="list-group">
    //       <select onclick={(e) => setChannelType(e.target.value)}>
    //         <option value="public" id="coucou">
    //           Public
    //         </option>
    //         <option value="private" id="coucou">
    //           Private
    //         </option>
    //         <option value="protected">
    //           Protected
    //         </option>
    //       </select>
    //       <input
    //           type="name"
    //           id="coucou"
    //           className="form-control password-margin"
    //           placeholder="Password"
    //           disabled>
    //       </input>
    //     </ul>
    //   </form>
    // </>

    <>
      <label className="form-label">Name</label>
      <input type="name" className="form-control form-control-margin" placeholder="# channel-name"></input>
      <div className="form-check">
        <input className="form-check-input radio-custom" type="radio" name="channelRadios" id="channelRadio1" value="option1" 
        onClick={() => {
          const bsCollapse = document.getElementById('collapseProtected');
          bsCollapse?.classList.remove('show');
        }}
        ></input>
        <label className="form-check-label" htmlFor="channelRadios1">
          Public
        </label>
      </div>
      <div className="form-check">
        <input className="form-check-input radio-custom" type="radio" name="channelRadios" id="channelRadio2" value="option2"
        onClick={() => {
          const bsCollapse = document.getElementById('collapseProtected');
          bsCollapse?.classList.remove('show');
        }}
        ></input>
        <label className="form-check-label" htmlFor="channelRadios2">
          Private
        </label>
      </div>
      <div className="form-check">
        <input
          className="form-check-input radio-custom"
          type="radio"
          name="channelRadios"
          id="channelRadio3"
          value="option3"
          data-bs-toggle="collapse" data-bs-target="#collapseProtected" aria-expanded="false" aria-controls="collapseProtected">
        </input>
        <label className="form-check-label" htmlFor="channelRadios3">
          Protected
        </label>
        <div className="collapse collapse-margin" id="collapseProtected">
          <input type="name" className="form-control form-control-margin" placeholder="Password"></input>
        </div>
      </div>
    </>
  );
}

