import './CreateChannel.css';
import { useState } from 'react';
import { eChannelType, eEvent } from './constants';
import { fetchUrl } from './utils';

export default function CreateChannel({ userId, socket, handleCreateChannel, ...props }: any) {
  const [channelName, setChannelName] = useState('');
  const [channelPassword, setChannelPassword] = useState('');
  const [channelType, setChannelType] = useState(eChannelType.PUBLIC);

  return (
      <form
        id="createChannelForm"
        className="form-label"
        onSubmit={(e) => handleCreateChannel(e, channelName, channelType, userId, channelPassword)}>
        <label className="form-label">Name</label>
        <input
          type="name"
          className="form-control form-control-margin"
          placeholder="# channel-name"
          onChange={(e) => setChannelName(e.target.value)}
          value={channelName}></input>
        <ul className="list-group">
          <select onChange={(e) => setChannelType(e.target.value as eChannelType)}>
            <option value={eChannelType.PUBLIC}>Public</option>
            <option value={eChannelType.PRIVATE}>Private</option>
            <option value={eChannelType.PROTECTED}>Protected</option>
          </select>
          <input
            onChange={(e) => setChannelPassword(e.target.value)}
            value={channelPassword}
            type="name"
            className="form-control form-control-margin"
            placeholder="Password"></input>
        </ul>
      </form>
  );
}

