import './chat.css';
import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { Message, Channel } from './entities';
import { Events } from './events';

export default function Chat({ socket, ...props }: { socket: Socket }) {
  const [allMessages, setAllMessages] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allChannels, setAllChannels] = useState([]);
  const [currentChannel, setCurrentChannel] = useState('lobby');
  const [message, setMessage] = useState('');
  const [createChannelName, setCreateChannelName] = useState('');
  const [createChannelPassword, setChannelPassword] = useState('');
  const [createChannelType, setChannelType] = useState('public');

  const handleMessageChange = (e: any) => {
    setMessage(e.target.value);
  };
  const handleSubmit = (e: any) => {
    if (message === '') return;
    const date = Date.now();
    const channel: Channel = { id: '', userIdList: [], name: currentChannel };
    const messageToSend: Message = { id: '', content: message, date, channel };
    socket.emit(Events.sendMessage, messageToSend);
    setMessage('');
  };

  const handleJoinChannel = (e: any, channel: string) => {
    socket.emit(Events.joinChannel, channel);
    setCurrentChannel(channel);
  };

  const handleCreateChannel = (e: any) => {
    const payload = {
      name: createChannelName,
      type: createChannelType,
      password: createChannelPassword
    };
    console.log(`Handle create channel ${JSON.stringify(payload, null, 4)}`);
    e.preventDefault();
    if (
      createChannelName === '' ||
      (createChannelType === 'protected' && createChannelPassword === '')
    )
      return;
    socket.emit(Events.createChannel, payload);
    setCreateChannelName('');
  };

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server successfully');

      const userId = document.cookie;
      console.log(`This is user id on connect ${userId}`);
      if (userId === null || userId === '') {
        socket.emit('setId');
        socket.on('setId', (id) => {
          document.cookie = id;
          console.log(`Setting id from server ${id}`);
          socket.emit('addUser', id);
        });
      }
    });

    socket.on(Events.updateMessages, (messages) => {
      if (messages.length !== 0) {
        setAllMessages(messages);
      }
    });
    socket.on(Events.updateUsers, (allUsers) => {
      setAllUsers(allUsers);
    });
    socket.on(Events.updateUsers, (payload: Message) => {
      console.log(`Client has joinied channel! ${JSON.stringify(payload.channel, null, 4)}`);
    });
    socket.on(Events.updateChannels, (channels) => {
      if (channels.length > 0) {
        setAllChannels(channels);
      }
    });
    console.log(`This is the list of all users`);
    allUsers.map((user) => console.log(`This is user ${JSON.stringify(user, null, 4)}`));
  }, []);

  return (
    <div className="chat">
      <div
        className="blueBoxChat"
        style={{
          width: '20%',
          height: '80vh'
        }}>
        <form onSubmit={handleCreateChannel}>
          <input
            className="createChannel"
            onChange={(e) => setCreateChannelName(e.target.value)}
            value={createChannelName}
          />
          <select onChange={(e) => setChannelType(e.target.value)}>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="protected">Protected</option>
          </select>
          <input
            className="createChannelPassword"
            onChange={(e) => setChannelPassword(e.target.value)}
            value={createChannelPassword}
          />
          <button className="createChanneButton" type="submit">
            Create Channel
          </button>
        </form>
        <br />
        <div className="channels">
          {allChannels.map((channel: Channel) => (
            <button
              key={channel.id}
              className="channelButton"
              onClick={(e) => handleJoinChannel(e, channel.name)}>
              {channel.name}
            </button>
          ))}
        </div>
      </div>
      <div
        className="blueBoxChat"
        style={{
          width: '80%',
          height: '80vh'
        }}>
        <div className="channel">
          -------Channel: {currentChannel}-------
          <br />
          <br />
        </div>
        <div className="conversation">
          <ul className="messages">
            <>
              {allMessages?.map((message: Message) =>
                message.channel.name === currentChannel ? (
                  <li key={message.id}>{message.content}</li>
                ) : (
                  ''
                )
              )}
            </>
          </ul>
        </div>
        <div className="chatInput">
          <input
            className="chatInputField"
            placeholder="send a message.."
            onChange={handleMessageChange}
            value={message}></input>
          <button className="btn btn-light" onClick={handleSubmit}>
            Send!
          </button>
        </div>
      </div>
    </div>
  );
}
