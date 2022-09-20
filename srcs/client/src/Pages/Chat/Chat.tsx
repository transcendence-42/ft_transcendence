import './chat.css';
import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { Message, Channel, JoinChannelDto, ChatUser } from './entities';
import { Events } from './events';
import { ChannelTypes } from './channelTypes';

const lobbyChannel: Channel = {
  name: 'lobby',
  type: ChannelTypes.public,
  id: '',
  userIdList: []
};

export default function Chat({ socket, ...props }: { socket: Socket }) {
  const [user, setUser] = useState({} as ChatUser);
  const [allMessages, setAllMessages] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allChannels, setAllChannels] = useState([]);
  const [currentChannel, setCurrentChannel] = useState(lobbyChannel);
  const [message, setMessage] = useState('');
  const [createChannelName, setCreateChannelName] = useState('');
  const [createChannelPassword, setCreateChannelPassword] = useState('');
  const [createChannelType, setCreateChannelType] = useState('public');
  const [joinChannelPassword, setJoinChannelPassword] = useState({});

  const getValueOf = (key: string, obj: Record<string, string>) => obj[key];

  const handleMessageChange = (e: any) => {
    setMessage(e.target.value);
  };
  const handleSubmit = (e: any) => {
    if (message === '') return;
    const date = Date.now();
    const messageToSend: Message = { id: '', content: message, date, channel: currentChannel };
    socket.emit(Events.sendMessage, messageToSend);
    setMessage('');
  };

  const handleJoinChannel = (e: any, channelId: string) => {
    e.preventDefault();
    const channel = allChannels.find((chan: Channel) => chan.id === channelId);
    console.log(`This is the channel ${JSON.stringify(channel, null, 4)}`);
    if (!channel) {
      console.log(`Error could not find channel with id ${channelId} to join`);
      return;
    }
    if (
      channel['type'] === ChannelTypes.protected &&
      getValueOf(channelId, joinChannelPassword) === ''
    ) {
      return alert('You must provide a Password!');
    }

    const channelDto: JoinChannelDto = { ...(channel as Channel) };
    socket.emit(Events.joinChannel, {
      name: channelDto.name,
      id: channelDto.id,
      type: channelDto.type,
      password: channelDto.password
    });
    console.log(`This is join channel dto ${JSON.stringify(channelDto, null, 4)}`);
    setJoinChannelPassword('');
  };

  const handleCreateChannel = (e: any) => {
    e.preventDefault();
    if (createChannelName === '') return alert("Channel name can't be empty");
    else if (createChannelType === 'protected' && createChannelPassword === '')
      return alert("Password can't be empty!");
    const payload = {
      name: createChannelName,
      type: createChannelType,
      password: createChannelPassword,
      ownerId: user.id
    };
    socket.emit(Events.createChannel, payload);
    setCreateChannelName('');
    setCreateChannelPassword('');
  };

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server successfully');

      // Will be deleted in favour of using cookies
      socket.emit(Events.setId);
      socket.on(Events.setIdResponse, (id: string) => {
        document.cookie = `id=${id}`;
        console.log(`Setting id from server ${id}`);
        socket.emit(Events.addUser, id);
      });
      socket.on(Events.addUserResponse, (user: ChatUser) => {
        setUser(user);
      });
    });

    socket.on(Events.joinChannelAnwser, (newChannel) => {
      console.log(
        `Answer recieved form the server for joinChanel ${JSON.stringify(newChannel, null, 4)}`
      );
      if (newChannel) {
        setCurrentChannel(newChannel);
      } else return alert("You can't join this channel because you are not allowed!");
    });

    socket.on(Events.updateMessages, (messages) => {
      if (messages.length !== 0) {
        setAllMessages(messages);
      }
    });

    socket.on(Events.updateUsers, (allUsers) => {
      setAllUsers(allUsers);
    });

    socket.on(Events.updateChannels, (channels) => {
      if (channels.length > 0) {
        setAllChannels(channels);
      }
    });
    // // console.log(`This is the list of all users`);
    // allUsers.map((user) => console.log(`This is user ${JSON.stringify(user, null, 4)}`));
  }, []);

  return (
    <div className="chat">
      <div
        className="blueBoxChat"
        style={{
          width: '20%',
          height: '80vh'
        }}>
        <form style={{ margin: '15px ' }} onSubmit={handleCreateChannel}>
          <div style={{ color: 'white' }}> Create a Channel</div>
          <input
            className="createChannel"
            onChange={(e) => setCreateChannelName(e.target.value)}
            value={createChannelName}
          />
          <select onChange={(e) => setCreateChannelType(e.target.value)}>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="protected">Protected</option>
          </select>
          <div style={{ color: 'white' }}>Set a password for your channel</div>
          <input
            className="createChannelPassword"
            onChange={(e) => setCreateChannelPassword(e.target.value)}
            value={createChannelPassword}
          />
          <button className="createChanneButton" type="submit">
            Create Channel
          </button>
        </form>
        <br />
        <div className="channels">
          {allChannels.map((channel: Channel) => (
            <form key={channel.id} onSubmit={(e) => handleJoinChannel(e, channel.id)}>
              <button className="channelButton" type="submit">
                {channel.name}
              </button>
              <input
                className={`joinChannelPwdInput ${channel.id}`}
                value={getValueOf(channel.id, joinChannelPassword)}
                onChange={(e) => setJoinChannelPassword(e.target.value)}
              />
            </form>
          ))}
        </div>
      </div>
      <div
        className="blueBoxChat"
        style={{
          width: '60%',
          height: '80vh',
          color: 'white'
        }}>
        <div className="channel">
          -------Channel: {currentChannel.name}-------
          <br />
          <br />
        </div>
        <div className="conversation">
          <ul className="messages">
            <>
              {allMessages?.map((message: Message) => {
                if (message.channel.name === currentChannel.name)
                  return <li key={message.id}>{message.content}</li>;
              })}
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
      <div
        className="blueBoxChat"
        style={{
          width: '20%',
          height: '80vh',
          color: 'white'
        }}>
        <div style={{ margin: '15px' }} className="currentUser">
          <div style={{fontSize: '20px'}}>Current User:</div>
          <div className="user">
            <br />
            Username: {user?.name}
            <br />
            id: {user?.id}
          </div>
        </div>
        Connected Users:
        <br />
        <div style={{ margin: '15px' }} className="listOfUsers">
          {allUsers &&
            allUsers.map((user: ChatUser) => (
              <div key={user.id} className="connectedUser">
                <br />
                Username: {user.name}
                <br />
                id: {user.id}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
