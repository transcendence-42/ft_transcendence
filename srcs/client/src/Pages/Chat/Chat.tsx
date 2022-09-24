import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './chat.css';
import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import ChatModal from '../../Components/Modal/ChatModals';
import PongAdvancedModal from '../../Components/Modal/PongAdvancedModal';
import BrowseChannels from './BrowseChannels';
import CreateChannel from './CreateChannel';
import FriendList from './FriendList';
import {
  MessageDto,
  Channel,
  JoinChannelDto,
  ChatUser,
  Message,
  Hashtable,
  ChannelUser
} from './entities';
import { eEvent, eChannelType, eChannelUserRole} from './constants';

const isEmpty = (obj: any) => {
  for (const i in obj) return false;
  return true;
}

const lobbyChannel: Channel = {
  name: 'lobby',
  type: eChannelType.Public,
  id: '24098932842',
  createdAt: 0,
  users: {}
};

export default function Chat({ socket, ...props }: { socket: Socket }) {
  const currChanInLocalStorage = window.localStorage.getItem('currentChannel');
  const defaultChannel: Channel = currChanInLocalStorage ? JSON.parse(currChanInLocalStorage) : lobbyChannel;
  const [trueUser, setTrueUser] = useState(null);
  const [user, setUser] = useState({} as ChatUser);
  const [allMessages, setAllMessages] = useState([] as Message[]);
  const [allUsers, setAllUsers] = useState({} as Hashtable<ChatUser>);
  const [allChannels, setAllChannels] = useState({} as Hashtable<Channel>);
  const [currentChannel, setCurrentChannel] = useState(defaultChannel);
  const [message, setMessage] = useState('');
  const [friends, setFriends] = useState({});
  const [currentUser, setCurrentUser] = useState({})

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

  const getValueOf = (key: string, obj: Record<string, string>) => obj[key];

  const handleMessageChange = (e: any) => {
    setMessage(e.target.value);
  };
  const handleSendMessage = (e: any) => {
    if (message === '') return;
    console.log(`Heres current user ${JSON.stringify(user, null, 4)}`)
    console.log(`Heres current channel ${JSON.stringify(currentChannel, null, 4)}`)
    const messageToSend: MessageDto = {
      content: message,
      toChannelOrUserId: currentChannel.id,
      fromUserId: user.id
    };
    console.log("Emitting message")
    socket.emit(eEvent.SendMessage, messageToSend);
    setMessage('');
  };

  const handleJoinChannel = (e: any, channelId: string) => {
    e.preventDefault();
    const channel: Channel = allChannels[channelId];
    console.log(`This is the channel ${JSON.stringify(channel, null, 4)}`);
    if (!channel) {
      console.log(`Channel with id ${channelId} doesnt exist`);
      return;
    }
    if (
      channel['type'] === eChannelType.Protected &&
      getValueOf(channelId, joinChannelPassword) === ''
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
    fetch('http://127.0.0.1:4200/auth/success/', {
      credentials: 'include',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": "true",
      }
    })
    .then((response) => {
      if (!response.ok)
      {
        console.warn("Failed to fetch user data")
      }
      return response.json();
    })
    .then((responseObj) => {
      console.log(`User data rom success ${JSON.stringify(responseObj.user, null, 4)}`)
      setTrueUser(responseObj.user);
    })

  },[])

  useEffect(()=> {
    fetch(`http://127.0.0.1:4200/users/${(trueUser && trueUser['id']) || "1"}/friends`, {
    credentials: 'include',
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": "true"
    }
    }
  )
  .then((response) => {
    if (response.ok) {console.warn("Erro while gettings friends")}
    return response.json();
  })
  .then((responseObj) => {
    console.log(`Freinds of user ${(trueUser && trueUser['id']) || "1"} are ${JSON.stringify(responseObj, null, 4)}`)
  })
}, [])

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server successfully');

      // Will be deleted in favour of using cookies
      socket.emit(eEvent.SetId);
    });
    socket.on(eEvent.SetIdResponse, (id: string) => {
      document.cookie = `id=${id}`;
      console.log(`Setting id from server ${id}`);
      socket.emit(eEvent.AddUser, id);
    });
    socket.on(eEvent.AddUserResponse, (user: ChatUser) => {
      console.log(`REcieving user response ${JSON.stringify(user, null, 4)}`)
      setUser(user);
    });

    socket.on(eEvent.CreateChannelResponse, (data: { msg: string; channel: Channel }) => {
      if (!data.channel) {
        return alert(data.msg);
      }
      setCurrentChannel(data.channel);
      window.localStorage.setItem('currentChannel', JSON.stringify(data.channel));
      return alert(data.msg);
    });

    socket.on(eEvent.JoinChannelResponse, (data) => {
      console.log(
        `Answer recieved form the server for joinChanel ${JSON.stringify(data, null, 4)}`
      );
      if (data.channel) {
        setCurrentChannel(data.channel);
      } else return alert(`${data.msg}`);
    });

    socket.on(eEvent.UpdateMessages, (messages: Message[]) => {
      setAllMessages(messages.sort((a, b) => (a.sentDate > b.sentDate) ? 1: -1));
    });

    socket.on(eEvent.UpdateOneMessage, (message: Message) => {
      console.log(`Updating one message ${JSON.stringify(message, null, 4)}`)
        const newAllMessages: Message[] = allMessages;
        allMessages.push(message);
      setAllMessages(newAllMessages);
    })

    socket.on(eEvent.UpdateUsers, (allUsers) => {
      setAllUsers(allUsers);
    });

    socket.on(eEvent.UpdateOneUser, (user: ChatUser) => {
      const newAllUsers: Hashtable<ChatUser> = allUsers;
      allUsers[user.id] = user;
      setAllUsers(newAllUsers);
    })

    socket.on(eEvent.UpdateChannels, (channels) => {
      setAllChannels(channels);
    });

    socket.on(eEvent.UpdateOneChannel, (channel: Channel) => {
      const newAllChannels: Hashtable<Channel> = allChannels;
      allChannels[channel.id] = channel;
      setAllChannels(newAllChannels);
    })

    socket.on(eEvent.AddedToRoom, (channelId: string) => {
      console.log(`Recieved event added to room`);
      socket.emit(eEvent.AddedToRoom, channelId);
    });
    // // console.log(`This is the list of all users`);
    // allUsers.map((user) => console.log(`This is user ${JSON.stringify(user, null, 4)}`));
    return () => {
      socket.off('connect');
      socket.off(eEvent.UpdateMessages);
      socket.off(eEvent.UpdateOneMessage);
      socket.off(eEvent.UpdateUsers);
      socket.off(eEvent.UpdateOneUser);
      socket.off(eEvent.UpdateChannels);
      socket.off(eEvent.UpdateOneChannel);
      socket.off(eEvent.UpdateOneChannel);
      socket.off(eEvent.AddUserResponse);
      socket.off(eEvent.SetIdResponse);
      socket.off(eEvent.CreateChannelResponse);
      socket.off(eEvent.AddedToRoom);
    };
  });

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
        <BrowseChannels allChannels={allChannels} handleJoinChannel={handleJoinChannel} />
      </PongAdvancedModal>
      <ChatModal
        title="Create a channel"
        show={showCreateChannel}
        closeHandler={handleCloseCreateChannel}
        textBtn1="Cancel"
        handleBtn1={handleCloseCreateChannel}
        textBtn2="Create">
        <CreateChannel socket={socket} userId={user?.id} />
      </ChatModal>
      <PongAdvancedModal
        title="Select a friend"
        show={showFriendList}
        closeHandler={handleCloseFriendList}
        textBtn1="Cancel"
        handleBtn1={handleCloseFriendList}
        textBtn2="Validate"
        handleBtn2={handleCloseFriendList}>
        <FriendList />
      </PongAdvancedModal>
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
      {!isEmpty(allChannels) && Object.values(allChannels).map((channel: Channel) => (
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
      ))}</>
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
            <div className="col overflow-auto scroll-bar">
            </div>
          </div>
        </div>
        <div className="col-8 rounded-4 blue-box-chat">
          <div className="row">
            <div className="col">
              <p className="blue-titles channel-name-margin">currentChannel: {currentChannel.name}</p>
            </div>
          </div>
          <div className="row">
            <>{console.log(`List of all users${JSON.stringify(allUsers)}`)}</>

              <> {allMessages?.map((message: Message) => 
              (user && message.toChannelOrUserId === currentChannel.id ? <div className={message.fromUserId === user.id ? "myMessages" : "otherMessages"} key={message.id}>
                <div className='messageFromUser'>User: {(allUsers[message.fromUserId] || {name: "Pong Bot"}).name}</div>
                <br/>
                <div className="messageDate"> .  Date:  {new Date(message.sentDate).toLocaleString()}</div>
                <br/>
                <div className="messageContent"> .   Message: .   {message.content}</div>
                <br/>
              </div>: ''))}
              </>
            <div className="col input-position">
              <input
              onChange={(e) => setMessage(e.target.value)}
              value={message}
                type="text"
                maxLength={128}
                className="rounded-3 input-field-chat yellow-box-chat"
                placeholder="Send a message..."></input>
                <button type="button" onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        </div>
        <div className="col-2 rounded-4 blue-box-chat">
          <div className="row">
            <div className="col">
              <p className="blue-titles center-position titles-position">MEMBERS</p>
              <>{!isEmpty(currentChannel) && Object.values(currentChannel.users).map((user: ChannelUser) => <div key={user.id}>{allUsers && allUsers[user.id]?.name}</div>)}
      {console.log(`Are the objects empty ${!isEmpty(allChannels)}`)}
      {console.log(`list of channels ${JSON.stringify(allChannels, null, 4)}`)}
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
