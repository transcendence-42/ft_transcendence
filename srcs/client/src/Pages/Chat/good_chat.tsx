import './chat.css';
// import '../../Components/Tools/Box.css';
import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { Message, Channel } from './entities';

export default function Chat({ socket, ...props }: { socket: Socket }) {
  const [message, setMessage] = useState('');
  const [allMessages, setAllMessages] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentChannel, setCurrentChannel] = useState('lobby');
  const [createChannelName, setCreateChannelName] = useState('');
  const [allChannels, setAllChannels] = useState([]);

  const handleMessageChange = (e: any) => {
    setMessage(e.target.value);
  };
  const handleSubmit = (e: any) => {
    if (message === '') return;
    const date = Date.now();
    const channel: Channel = { id: '', userIdList: [], name: currentChannel };
    const messageToSend: Message = { id: '', content: message, date, channel };
    socket.emit('sendMessage', messageToSend);
    setMessage('');
  };

  const handleJoinChannel = (e: any, channel: string) => {
    socket.emit('joinChannel', channel);
    setCurrentChannel(channel);
  };

  const handleCreateChannelChange = (e: any) => {
    setCreateChannelName(e.target.value);
  };

  const handleCreateChannelSubmit = (e: any) => {
    if (createChannelName !== '') socket.emit('createChannel', createChannelName);
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

    socket.on('updateMessages', (messages) => {
      if (messages.length !== 0) {
        setAllMessages(messages);
        window.sessionStorage.setItem('allMessages', JSON.stringify(messages));
      }
    });
    socket.on('updateUsers', (allUsers) => {
      setAllUsers(allUsers);
    });
    socket.on('userJoined', (payload: Message) => {
      console.log(`Client has joinied channel! ${JSON.stringify(payload.channel, null, 4)}`);
    });
    socket.on('updateChannels', (channels) => {
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
        <input
          className="createChannel"
          onChange={handleCreateChannelChange}
          value={createChannelName}
        />
        <button className="createChanneButton" onClick={handleCreateChannelSubmit}>
          Create Channel
        </button>
        <br />
        <div className="channels">
          {allChannels.map((channel: Channel) => (
            <button className="channelButton" onClick={(e) => handleJoinChannel(e, channel.name)}>
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
            {/* {JSON.parse(window.sessionStorage.getItem('allMessages') || '[]').length !== 0  */}
            {allMessages.length > 0 ? (
              <>
                {/* {JSON.parse(window.sessionStorage.getItem('allMessages') || '[]').map( */}
                {allMessages.map((message: Message) =>
                  message.channel.name === currentChannel ? (
                    <li key={message.id}>{message.content}</li>
                  ) : (
                    ''
                  )
                )}
              </>
            ) : (
              <>
                <li>{'Des messages'}</li>
                <li>{'Des messages'}</li>
                <li>{'Des messages'}</li>
                <li>{'Des messages'}</li>
              </>
            )}
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
