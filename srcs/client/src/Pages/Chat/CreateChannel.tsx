import './CreateChannel.css';
import { useState } from 'react';
import { CreateChannelDto } from './entities';
import { eChannelType, eEvent } from './constants';
import { fetchUrl } from './utils';

export default function CreateChannel({ userId, socket, addChannel, ...props }: any) {
  const [channelName, setChannelName] = useState('');
  const [channelPassword, setChannelPassword] = useState('');
  const [channelType, setChannelType] = useState(eChannelType.PUBLIC);

  const handleCreateChannel = (e: any) => {
    e.preventDefault();
    if (channelName === '') return alert("channel name can't be empty");
    else if (channelType === eChannelType.PROTECTED && channelPassword === '')
      return alert("Password can't be empty!");
    const createChannelDto: CreateChannelDto = {
      name: channelName,
      type: channelType,
      ownerId: userId,
      password: channelPassword
    };
    const getChannel = async () => {
      const channel = await fetchUrl('http://127.0.0.1:4200/channel/', 'PUT', createChannelDto);
      if (channel['id']) {
        const payload = { id: channel.id, type: channel.type };
        socket.emit(eEvent.UpdateOneChannel, payload);
      } else return alert(`Error while creating channel! ${channel.message}`);
    };
    getChannel();
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
    </>
  );
}
