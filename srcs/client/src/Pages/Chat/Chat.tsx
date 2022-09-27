import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './chat.css';
import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import ChatModal from '../../Components/Modal/ChatModals';
import PongAdvancedModal from '../../Components/Modal/PongAdvancedModal';
import BrowseChannels from './BrowseChannels';
import CreateChannel from './CreateChannel';
import FriendList from './FriendList';
import { MessageDto, Channel, JoinChannelDto, ChatUser, Message, UserOnChannel } from './entities';
import { eEvent, eChannelType, eUserRole } from './constants';
import { fetchUrl } from './utils';
import { CreateChannelDto } from './entities';

const isEmpty = (obj: any) => {
  for (const i in obj) return false;
  return true;
};

const lobbyChannel: Channel = {
  name: 'lobby',
  type: eChannelType.PUBLIC,
  id: 24098932842,
  users: []
};

export default function Chat({ socket, ...props }: { socket: Socket }) {
  const currChanInLocalStorage = window.localStorage.getItem('currentChannel');
  const defaultChannel: Channel = currChanInLocalStorage
    ? JSON.parse(currChanInLocalStorage)
    : lobbyChannel;
  const [user, setUser] = useState({} as ChatUser);
  const [allMessages, setAllMessages] = useState([] as Message[]);
  const [allUsers, setAllUsers] = useState([] as ChatUser[]);
  const [allChannels, setAllChannels] = useState([] as Channel[]);
  // const [allChannels, setAllChannels] = useState([] as Channel[]);
  const [currentChannel, setCurrentChannel] = useState(defaultChannel);
  const [message, setMessage] = useState('');
  const [friends, setFriends] = useState([]);
  const [userFetched, setUserFetched] = useState(false);

  const [joinChannelPassword, setJoinChannelPassword] = useState({});
  // state
  const [showBrowseChannel, setShowBrowseChannel] = useState(false);
  const [showCreateChannel, setshowCreateChannel] = useState(false);
  const [showFriendList, setshowFriendList] = useState(false);

  // handlers
  const handleCloseCreateChannel = () => setshowCreateChannel(false);
  const handleShowCreateChannel = () => setshowCreateChannel(true);

  const handleCloseBrowseChannel = () => setShowBrowseChannel(false);
  const handleShowBrowseChannel = () => setShowBrowseChannel(true);

  const handleCloseFriendList = () => setshowFriendList(false);
  const handleShowFriendList = () => setshowFriendList(true);

  const getValueOf = (key: number, obj: Record<number, string>) => obj[key];

  const createChannel = async (createChannelDto: CreateChannelDto) => {
    const channel = await fetchUrl('http://127.0.0.1:4200/channel/', 'PUT', createChannelDto);
    if (channel['id']) {
      const userOnChannel = await fetchUrl(
        `http://127.0.0.1:4200/channel/${channel.id}/useronchannel/${channel.ownerId}`,
        'GET'
      );
      const payload = { id: channel.id, type: channel.type };
      socket.emit(eEvent.UpdateOneChannel, payload);
      updateOwnChannels(userOnChannel);
      return channel['id'];
    } else return alert(`Error while creating channel! ${channel.message}`);
  };

  const handleCreateChannel = (
    e: any,
    name: string,
    type: eChannelType,
    ownerId: number,
    password?: string
  ) => {
    e.preventDefault();
    if (name === '') return alert("channel name can't be empty");
    else if (type === eChannelType.PROTECTED && password === '')
      return alert("Password can't be empty!");
    const createChannelDto: CreateChannelDto = {
      name,
      type,
      ownerId,
      password
    };
    const channelId = createChannel(createChannelDto);
    return channelId;
  };
  const handleAddToChannel = async (userId: number, channelId: number) => {
    const createUserOnChannelDto = {
      role: eUserRole.USER,
      userId,
      channelId
    };
    const newUser = await fetchUrl(
      `http://127.0.0.1:4200/channel/${channelId}/useronchannel/`,
      'PUT',
      createUserOnChannelDto
    );
    if (newUser['userId']) {
      // to be modified later to include a better way of handling error
      socket.emit(eEvent.AddUser, userId);
      const updatedChannels = allChannels.map((channel: Channel) => {
        if (channel.id === channelId) {
          channel.users?.push(newUser);
        }
        return channel;
      });
    } else {
      //to be changed for a better way of handling error
      return alert(`Error while adding user to channel ${JSON.stringify(newUser, null, 4)}`);
    }
  };

  const updateOwnChannels = (userOnChannel: UserOnChannel) => {
    let updateAllChannels: UserOnChannel[] = [];
    if (user.channels) {
      updateAllChannels = user.channels;
    }
    updateAllChannels?.push(userOnChannel);
    setUser((prevUser: ChatUser) => ({ ...prevUser, channels: updateAllChannels }));
  };

  const addChannel = (channel: any) => {
    const updatedChannels: Channel[] = allChannels;
    console.log(`Here are all channels before updating ${user.channels}`);
    updatedChannels.push(channel);
    setAllChannels(updatedChannels);
  };

  const handleMessageChange = (e: any) => {
    setMessage(e.target.value);
  };
  const handleSendMessage = (e: any) => {
    if (message === '') return;
    console.log(`Heres current user ${JSON.stringify(user, null, 4)}`);
    console.log(`Heres current channel ${JSON.stringify(currentChannel, null, 4)}`);
    const messageToSend: MessageDto = {
      content: message,
      toChannelOrUserId: currentChannel.id,
      fromUserId: user.id
    };
    console.log('Emitting message');
    socket.emit(eEvent.SendMessage, messageToSend);
    setMessage('');
  };

  const openChannel = (e: any, channel: Channel) => {
    setCurrentChannel(channel);
  };

  const handleJoinChannel = (e: any, channel: Channel) => {
    e.preventDefault();
    console.log(`This is the channel ${JSON.stringify(channel, null, 4)}`);
    if (!channel) {
      console.log(`Channel doesnt exist`);
      return;
    }
    if (
      channel['type'] === eChannelType.PROTECTED &&
      getValueOf(channel.id, joinChannelPassword) === ''
    ) {
      return alert('You must provide a Password!');
    }

    const channelDto: JoinChannelDto = { userId: user.id, ...channel };
    socket.emit(eEvent.JoinChannel, {
      name: channelDto.name,
      id: channelDto.id,
      userId: user.id,
      password: channelDto.password
    });
    console.log(`This is join channel dto ${JSON.stringify(channelDto, null, 4)}`);
    setJoinChannelPassword('');
  };

  useEffect(() => {
    const initChatUser = async () => {
      const response = await fetchUrl('http://127.0.0.1:4200/auth/success/', 'GET');
      const { user } = response;
      console.log(`Here the user obj ${JSON.stringify(user, null, 4)}`);
      setUser(user);
      if (user && user.id) {
        const friends = await fetchUrl(`http://127.0.0.1:4200/users/${user.id}/friends`, 'GET');
        if (!friends || friends.length !== 0) {
          setFriends(friends);
        }
        socket.connect();
        const channels = await fetchUrl(`http://127.0.0.1:4200/channel`, 'GET');
        if (channels) setAllChannels(channels);
      } else {
        console.error(`There's a problem. Couldn't find user id to fetch friends`);
      }
    };
    initChatUser();
    console.info(`Heres true user after init !! ${JSON.stringify(user, null, 4)}`);
  }, []);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server successfully');
    });

    socket.on(eEvent.UpdateOneMessage, (message: Message) => {
      console.log(`Updating one message ${JSON.stringify(message, null, 4)}`);
      const newAllMessages: Message[] = allMessages;
      allMessages.push(message);
      setAllMessages(newAllMessages);
    });

    socket.on(eEvent.UpdateOneUser, (user: ChatUser) => {
      const newAllUsers: ChatUser[] = allUsers;
      allUsers[user.id] = user;
      setAllUsers(newAllUsers);
    });

    socket.on(eEvent.UpdateOneChannel, (channelId) => {
      const getNewChannel = async () => {
        const url = 'http://127.0.0.1:4200/channel/' + channelId;
        const channel = await fetchUrl(url, 'GET');
        addChannel(channel);
      };
      getNewChannel();
    });

    return () => {
      socket.off('connect');
      socket.off(eEvent.UpdateMessages);
      socket.off(eEvent.UpdateOneMessage);
      socket.off(eEvent.UpdateOneUser);
    };
  }, []);

  return (
    <>
      <PongAdvancedModal
        title="Browse channels"
        show={showBrowseChannel}
        closeHandler={handleCloseBrowseChannel}
        textBtn1="Cancel"
        handleBtn1={handleCloseBrowseChannel}
        textBtn2="Validate"
        handleBtn2={handleCloseBrowseChannel}>
        <BrowseChannels allChannels={allChannels} />
      </PongAdvancedModal>
      {console.log(`Heres hte user inside chatModal ${JSON.stringify(user, null, 4)}`)}
      {user && (
        <>
          {' '}
          <ChatModal
            title="Create a channel"
            show={showCreateChannel}
            closeHandler={handleCloseCreateChannel}
            textBtn1="Cancel"
            handleBtn1={handleCloseCreateChannel}
            textBtn2="Create">
            <CreateChannel
              socket={socket}
              userId={user.id}
              handleCreateChannel={handleCreateChannel}
            />
          </ChatModal>
          <PongAdvancedModal
            title="Select a friend"
            show={showFriendList}
            closeHandler={handleCloseFriendList}
            textBtn1="Cancel"
            handleBtn1={handleCloseFriendList}
            textBtn2="Validate"
            handleBtn2={handleCloseFriendList}>
            <FriendList
              userId={user.id}
              friends={friends}
              handleCreateChannel={handleCreateChannel}
              handleAddToChannel={handleAddToChannel}
            />
          </PongAdvancedModal>{' '}
        </>
      )}
      <div className="row row-color main-row-margin">
        <div className="col-2 rounded-4 vh-100 blue-box-chat">
          <div className="row">
            <div className="col">
              <p className="yellow-titles titles-position">CHANNELS</p>
            </div>
            <div className="col">
              <button
                className="float-end rounded-4 dropdown-toggle color-dropdown channel-button titles-position"
                data-bs-toggle="dropdown"
                aria-expanded="false"></button>
              <ul className="dropdown-menu channel-menu blue-box-chat">
                <li className="dropdown-item" onClick={handleShowBrowseChannel}>
                  Browse channels
                </li>
                <li className="dropdown-item" onClick={handleShowCreateChannel}>
                  Create a channel
                </li>
              </ul>
            </div>
          </div>
          <div className="row">
            <div className="col overflow-auto scroll-bar">
              <>
                <div className="row row-color">
                  <>
                    {!isEmpty(user) &&
                      user.channels?.map((UserOnChannel: UserOnChannel) => (
                        <div className="channels" key={UserOnChannel.channelId}>
                          <div className="col">
                            <button
                              className="rounded-4 btn-pink btn-join"
                              onClick={(e) => openChannel(e, UserOnChannel.channel)}>
                              {UserOnChannel.channel.name}
                            </button>
                          </div>
                        </div>
                      ))}
                  </>
                </div>
              </>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <p className="yellow-titles titles-position">MESSAGES</p>
            </div>
            <div className="col">
              <button
                className="message-button float-end rounded-4 titles-position"
                onClick={handleShowFriendList}>
                +
              </button>
            </div>
          </div>
          <div className="row">
            <>
              {!isEmpty(user) &&
                user.channels?.map((UserOnChannel: UserOnChannel) =>
                  UserOnChannel.channel.type === eChannelType.DIRECT ? (
                    <div className="channels" key={UserOnChannel.channelId}>
                      <div className="col">
                        <button
                          className="rounded-4 btn-pink btn-join"
                          onClick={(e) => openChannel(e, UserOnChannel.channel)}>
                          {friends.find((friend: ChatUser) => (friend.id === (UserOnChannel.channel.users?.find((usr) => usr.userId !== user.id))?.userId)) ? 'yes' : 'no'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    ''
                  )
                )}
            </>
            <div className="col overflow-auto scroll-bar"></div>
          </div>
        </div>
        <div className="col-8 rounded-4 blue-box-chat">
          <div className="row">
            <div className="col">
              <p className="blue-titles channel-name-margin">
                currentChannel: {currentChannel.name}
              </p>
            </div>
          </div>
          <div className="row">
            <>{console.log(`List of all users${JSON.stringify(allUsers)}`)}</>

            <>
              {allMessages?.map((message: Message) =>
                user && message.toChannelOrUserId === currentChannel.id ? (
                  <div
                    className={message.fromUserId === user.id ? 'myMessages' : 'otherMessages'}
                    key={message.id}>
                    <div className="messageFromUser">
                      User: {(allUsers[message.fromUserId] || { username: 'Pong Bot' }).username}
                    </div>
                    <br />
                    <div className="messageDate">
                      {' '}
                      . Date: {new Date(message.sentDate).toLocaleString()}
                    </div>
                    <br />
                    <div className="messageContent"> . Message: . {message.content}</div>
                    <br />
                  </div>
                ) : (
                  ''
                )
              )}
            </>
            <div className="col input-position">
              <input
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                type="text"
                maxLength={128}
                className="rounded-3 input-field-chat yellow-box-chat"
                placeholder="Send a message..."></input>
              <button type="button" onClick={handleSendMessage}>
                Send
              </button>
            </div>
          </div>
        </div>
        <div className="col-2 rounded-4 blue-box-chat">
          <div className="row">
            <div className="col">
              <p className="blue-titles center-position titles-position">MEMBERS</p>
              <>
                {!isEmpty(currentChannel) &&
                  currentChannel.users?.map((user: UserOnChannel) => (
                    <div key={user.userId}>{allUsers && allUsers[user.userId]?.username}</div>
                  ))}
                {console.log(`Are the objects empty ${!isEmpty(user.channels)}`)}
                {console.log(`list of channels ${JSON.stringify(user.channels, null, 4)}`)}
              </>
            </div>
          </div>
        </div>
      </div>
    </>
    // <div className="chat">
    //   <div
    //     className="blueBoxChat"
    //     style={{
    //       width: '20%',
    //       height: '80vh'
    //     }}>
    //     <form style={{ margin: '15px ' }} onSubmit={handleCreateChannel}>
    //       <div style={{ color: 'white' }}> Create a Channel</div>
    //       <input
    //         className="createChannel"
    //         onChange={(e) => setCreateChannelName(e.target.value)}
    //         value={createChannelName}
    //       />
    //       <select onChange={(e) => setCreateChannelType(e.target.value)}>
    //         <option value="public".PUBLIC</option>
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
    //     <br />
    //     <div className="channels">
    //       {allChannels.map((channel: Channel) => (
    //         <form key={channel.id} onSubmit={(e) => handleJoinChannel(e, channel.id)}>
    //           <button className="channelButton" type="submit">
    //             {channel.name}
    //           </button>
    //           <input
    //             className={`joinChannelPwdInput ${channel.id}`}
    //             value={getValueOf(channel.id, joinChannelPassword)}
    //             onChange={(e) => setJoinChannelPassword(e.target.value)}
    //           />
    //         </form>
    //       ))}
    //     </div>
    //   </div>
    //   <div
    //     className="blueBoxChat"
    //     style={{
    //       width: '60%',
    //       height: '80vh',
    //       color: 'white'
    //     }}>
    //     <div className="channel">
    //       -------Channel: {currentChannel.name}-------
    //       <br />
    //       <br />
    //     </div>
    //     <div className="conversation">
    //       <ul className="messages">
    //         <>
    //           {allMessages?.map((message: Message) => {
    //             if (message.toChannelId === currentChannel.id)
    //               return <li key={message.id}>{message.content}</li>;
    //             return '';
    //           })}
    //         </>
    //       </ul>
    //     </div>
    //     <div className="chatInput">
    //       <input
    //         className="chatInputField"
    //         placeholder="send a message.."
    //         onChange={handleMessageChange}
    //         value={message}></input>
    //       <button className="btn btn-light" onClick={handleSubmitMessage}>
    //         Send!
    //       </button>
    //     </div>
    //   </div>
    //   <div
    //     className="blueBoxChat"
    //     style={{
    //       width: '20%',
    //       height: '80vh',
    //       color: 'white'
    //     }}>
    //     <div style={{ margin: '15px' }} className="currentUser">
    //       <div style={{ fontSize: '20px' }}>Current User:</div>
    //       <div className="user">
    //         <br />
    //         Username: {user?.name}
    //         <br />
    //         id: {user?.id}
    //       </div>
    //     </div>
    //     Connected Users:
    //     <br />
    //     <div style={{ margin: '15px' }} className="listOfUsers">
    //       {allUsers &&
    //         allUsers.map((user: ChatUser) => (
    //           <div key={user.id} className="connectedUser">
    //             <br />
    //             Username: {user.name}
    //             <br />
    //             id: {user.id}
    //           </div>
    //         ))}
    //     </div>
    //   </div>
    // </div>
  );
}
