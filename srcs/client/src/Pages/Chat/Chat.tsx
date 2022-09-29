import "bootstrap";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
import "./Chat.css";
import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import ChatModal from "../../Components/Modal/ChatModals";
import PongAdvancedModal from "../../Components/Modal/PongAdvancedModal";
import BrowseChannels from "./BrowseChannels";
import CreateChannel from "./CreateChannel";
import FriendList from "./FriendList";
import {
  MessageDto,
  Channel,
  JoinChannelDto,
  Message,
  UserOnChannel,
  Hashtable,
  User
} from "./entities";
import { eEvent, eChannelType, eUserRole } from "./constants";
import { fetchUrl } from "./utils";
import { CreateChannelDto } from "./entities";
import createChannelOnDb from "./functions/createChannelOnDb";
import handleCreateChannelForm from "./functions/createChannelForm";

const isEmpty = (obj: any) => {
  for (const i in obj) return false;
  return true;
};

const lobbyChannel: Channel = {
  name: "lobby",
  type: eChannelType.PUBLIC,
  id: 24098932842,
  users: []
};

export default function Chat(props: any) {
  const socket: Socket = props.socket;
  const currChanInLocalStorage = window.localStorage.getItem("currentChannel");
  const defaultChannel: Channel = currChanInLocalStorage
    ? JSON.parse(currChanInLocalStorage)
    : lobbyChannel;
  console.log(`Current channel init is ${currChanInLocalStorage}`);
  const [user, setUser] = useState({} as User);
  const [allMessages, setAllMessages] = useState({} as Hashtable<Message[]>);
  const [allUsers, setAllUsers] = useState({} as Hashtable<User>);
  const [allChannels, setAllChannels] = useState([] as Channel[]);
  const [currentChannel, setCurrentChannel] = useState(
    defaultChannel as Channel
  );
  const [isUserFetched, setIsUserFetched] = useState(false);
  const [message, setMessage] = useState("");
  const [friends, setFriends] = useState([]);
  const [createDirectId, setCreateDirectid] = useState("");

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

  const createDirect = async (e: any, friendId: number, userId: number) => {
    const channelName = friendId.toString() + "_" + userId.toString();
    const channelId = await handleCreateChannelForm(
      e,
      channelName,
      eChannelType.DIRECT,
      userId,
      socket,
      updateOwnChannels
    );
    if (channelId) {
      handleAddToChannel(friendId, channelId);
      handleCloseFriendList();
    } else return alert(`couldnt create channel with user ${friendId}`);
  };

  const getUser = async (userId: number) => {
    const user = await fetchUrl(`http://127.0.0.1:4200/users/${userId}`, "GET");
    return user;
  };

  const createNonDirectChannel = (
    e: any,
    name: string,
    type: eChannelType,
    ownerId: number,
    password?: string
  ) => {
    const channelId = handleCreateChannelForm(
      e,
      name,
      type,
      ownerId,
      socket,
      updateOwnChannels,
      password,
    );
    if (channelId) {
      handleCloseCreateChannel();
    }
  };

  const handleAddToChannel = async (userId: number, channelId: number) => {
    const createUserOnChannelDto = {
      role: eUserRole.USER,
      userId,
      channelId
    };
    const newUser = await fetchUrl(
      `http://127.0.0.1:4200/channel/${channelId}/useronchannel/`,
      "PUT",
      createUserOnChannelDto
    );
    if (newUser["userId"]) {
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
      return alert(
        `Error while adding user to channel ${JSON.stringify(newUser, null, 4)}`
      );
    }
  };

  const switchChannel = (channelId: number) => {
    const channel = allChannels.find((chan: Channel) => chan.id === channelId);
    console.log(`This is current channel id ${channel?.id}`);
    setCurrentChannel(channel!);
    localStorage.setItem("currentChannel", JSON.stringify(channel));
  };

  const updateOwnChannels = (userOnChannel: UserOnChannel) => {
    let updateAllChannels: UserOnChannel[] = [];
    if (user["channels"]) {
      updateAllChannels = user.channels;
    }
    updateAllChannels?.push(userOnChannel);
    setUser((prevUser: User) => ({
      ...prevUser,
      channels: updateAllChannels
    }));
  };

  const addChannel = (channel: any) => {
    const updatedChannels: Channel[] = allChannels;
    console.log(`Here are all channels before updating ${user.channels}`);
    updatedChannels.push(channel);
    setAllChannels(updatedChannels);
  };

  const handleSendMessage = (e: any) => {
    if (message === "") return;
    const messageToSend: MessageDto = {
      content: message,
      toChannelOrUserId: currentChannel.id,
      fromUserId: user.id
    };
    console.log("Emitting message", JSON.stringify(messageToSend, null, 4));
    socket.emit(eEvent.SendMessage, messageToSend);
    setMessage("");
  };

  const handleJoinChannel = (e: any, channel: Channel) => {
    e.preventDefault();
    console.log(`This is the channel ${JSON.stringify(channel, null, 4)}`);
    if (!channel) {
      console.log(`Channel doesnt exist`);
      return;
    }
    if (
      channel["type"] === eChannelType.PROTECTED &&
      getValueOf(channel.id, joinChannelPassword) === ""
    ) {
      return alert("You must provide a Password!");
    }

    const channelDto: JoinChannelDto = { userId: user.id, ...channel };
    socket.emit(eEvent.JoinChannel, {
      name: channelDto.name,
      id: channelDto.id,
      userId: user.id,
      password: channelDto.password
    });
    console.log(
      `This is join channel dto ${JSON.stringify(channelDto, null, 4)}`
    );
    setJoinChannelPassword("");
  };

  useEffect(() => {
    console.group("Use Effect #1: initChatUser");
    const initChatUser = async () => {
      console.log("fetching auth/success");
      const response = await fetchUrl(
        "http://127.0.0.1:4200/auth/success/",
        "GET"
      );
      console.log(`Fetched /auth/sucess`);
      const { user } = response;
      console.log("Setting user");
      setUser(user);
      console.log("setting user is fetched");
      setIsUserFetched(true);
      if (user && user.id) {
        console.log("fetching friends");
        const friends = await fetchUrl(
          `http://127.0.0.1:4200/users/${user.id}/friends`,
          "GET"
        );
        if (friends && friends.length !== 0) {
          console.log("setting friends");
          setFriends(friends);
        } else {
          console.log("no friends to set");
        }
      } else {
        console.error(
          `There's a problem. Couldn't find user id to fetch friends`
        );
      }
      console.log("Fetching channels");
      const channels = await fetchUrl(`http://127.0.0.1:4200/channel`, "GET");
      console.log("Fetched channels");

      if (channels) {
        console.log("setting all channels");
        setAllChannels(channels);
        console.log("set all channels");
      }
      // const users = await fetchUrl(`http://127.0.0.1:4200/users/`, "GET");
      console.log("Fetching all users");
      fetchUrl(`http://127.0.0.1:4200/users/`, "GET").then((users) => {
        const userHashTable: Hashtable<User> = {};
        console.log("Fetched  all users");
        for (const user of users) {
          userHashTable[user.id] = user;
        }
        console.log(
          `finished fetching uers and user hash ${JSON.stringify(
            userHashTable,
            null,
            4
          )}`
        );
        console.log("Setting all users");
        setAllUsers(userHashTable);
        console.log("Connecting to server");
        socket.connect();
      });
      console.groupEnd();
    };
    initChatUser();
    console.log(
      `user after async initChatUser() ${JSON.stringify(user, null, 4)}`
    );
  }, []);

  useEffect(() => {
    if (!isUserFetched) return;
    console.group("Use Effect #2 Events");
    socket.on("connect", () => {
      const channelIds: string[] = [];
      console.log(`This is user Id ${user.id}`);
      if (user.channels) {
        for (const chan of user.channels) {
          console.log(
            `this is channel id from user channels ${chan.channelId}`
          );
          channelIds.push(chan.channelId.toString());
        }
        console.log(`This is channel Ids Im pushing ${channelIds}`);
        socket.emit(eEvent.InitConnection, { channelIds, userId: user.id });
      }
      console.log("Connected to server successfully");
    });

    socket.on(eEvent.UpdateMessages, (messages: Hashtable<Message[]>) => {
      console.log(`Updatign all messages with ${JSON.stringify(messages)}`);
      setAllMessages(messages);
    });

    socket.on(eEvent.UpdateOneMessage, (message: Message) => {
      console.log(`Updating one message ${JSON.stringify(message)}`);
      const newAllMessages = allMessages;
      newAllMessages[message.toChannelOrUserId].push(message);
      setAllMessages(newAllMessages);
    });

    socket.on(eEvent.UpdateOneUser, (userId: number) => {
      const newAllUsers: Hashtable<User> = allUsers;
      const updateUser = async () => {
        const user = await getUser(userId);
        newAllUsers[userId] = user;
        setAllUsers(newAllUsers);
      };
      updateUser();
    });

    socket.on(eEvent.UpdateOneChannel, (channelId) => {
      const getNewChannel = async () => {
        const url = "http://127.0.0.1:4200/channel/" + channelId;
        const channel = await fetchUrl(url, "GET");
        addChannel(channel);
      };
      getNewChannel();
    });

    console.groupEnd();
    return () => {
      socket.off("connect");
      socket.off(eEvent.UpdateMessages);
      socket.off(eEvent.UpdateOneMessage);
      socket.off(eEvent.UpdateOneUser);
      socket.off(eEvent.InitConnection);
    };
  }, [isUserFetched]);

  //ENTER
  // const [input, setInput] = useState('');

  // const handleKeyDown = event => {
  //   console.log('User pressed: ', event.key);

  //   if (event.key === 'Enter') {
  //     // logic here
  //     console.log('Enter key pressed ✅');
  //   }
  // };

  return (
    <>
      <PongAdvancedModal
        title="Browse channels"
        show={showBrowseChannel}
        closeHandler={handleCloseBrowseChannel}
        textBtn1="Cancel"
        handleBtn1={handleCloseBrowseChannel}
        textBtn2="Validate"
        handleBtn2={handleCloseBrowseChannel}
      >
        <BrowseChannels
          allChannels={allChannels}
          userChannel={user?.channels}
          userId={user?.id}
        />
      </PongAdvancedModal>
      <ChatModal
        title="Create a channel"
        show={showCreateChannel}
        closeHandler={handleCloseCreateChannel}
        textBtn1="Cancel"
        handleBtn1={handleCloseCreateChannel}
        textBtn2="Create"
        handleBtn2={createNonDirectChannel}
      >
        <CreateChannel
          userId={user.id}
          friends={friends}
          createNonDirectChannel={createNonDirectChannel}
        />
      </ChatModal>
      <PongAdvancedModal
        title="Select a friend"
        show={showFriendList}
        closeHandler={handleCloseFriendList}
        textBtn1="Cancel"
        handleBtn1={handleCloseFriendList}
        textBtn2="Validate"
        handleBtn2={createDirect}
      >
        <FriendList
          userId={user.id}
          friends={friends}
          setCreateDirectId={setCreateDirectid}
        />
      </PongAdvancedModal>
      <div className="row mx-5 main-row">
        <div className="col-2 rounded-4 blue-box-chat">
          <div className="channels-div h-50">
            <div className="row mt-2">
              <div className="col overflow-auto">
                <p className="yellow-titles titles-position">CHANNELS</p>
              </div>
              <div className="col">
                <button
                  className="float-end rounded-4 dropdown-toggle color-dropdown channel-button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                ></button>
                <ul className="dropdown-menu channel-menu">
                  <li
                    className="dropdown-item"
                    onClick={handleShowBrowseChannel}
                  >
                    Browse channels
                  </li>
                  <li
                    className="dropdown-item"
                    onClick={handleShowCreateChannel}
                  >
                    Create a channel
                  </li>
                </ul>
              </div>
            </div>
            <div className="row h-75">
              <div className="col overflow-auto scroll-bar-channels ">
                <table>
                  <tbody>
                    {user?.channels?.map((usrOnChan: UserOnChannel) => (
                      <tr key={usrOnChan.channelId}>
                        <td onClick={(e) => switchChannel(usrOnChan.channelId)}>
                          {usrOnChan.channel.name}
                        </td>
                        <td>
                          <button className="rounded-4 btn btn-chat btn-pink">
                            leave
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="messages-div h-50">
            <div className="row">
              <div className="col overflow-auto">
                <p className="yellow-titles titles-position">MESSAGES</p>
              </div>
              <div className="col">
                <button
                  className="message-button float-end rounded-4 titles-position"
                  onClick={handleShowFriendList}
                >
                  +
                </button>
              </div>
            </div>
            <div className="row h-75">
              <div className="col  overflow-auto scroll-bar-direct">
                <table>
                  <tbody>
                    <tr>
                      <td>User</td>
                      <td>
                        <button className="rounded-4 btn btn-chat btn-pink">
                          game
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-8 rounded-4 blue-box-chat">
          <div className="row mt-2">
            <div className="col">
              <p className="blue-titles channel-name-margin">
                currentChannel: {currentChannel.name}
              </p>
            </div>
          </div>
          <div className="row h-75 pt-3">
            <div className="col h-100 overflow-auto scroll-bar-messages ">
              <div className="message-position">
                <>
                  {console.log(
                    `AllsMessges of current channelid ${JSON.stringify(
                      allMessages[currentChannel.id]
                    )}`
                  )}
                  {allMessages &&
                    allMessages[currentChannel.id]?.map((message: Message) => (
                      <div
                        className={
                          message.fromUserId === user.id
                            ? "myMessages"
                            : "otherMessages"
                        }
                        key={message.id}
                      >
                        <div className="messageFromUser">
                          User:
                          {allUsers[message.fromUserId].username || "Pong Bot"}
                        </div>
                        <br />
                        <div className="messageDate">
                          Date: {new Date(message.sentDate).toLocaleString()}
                        </div>
                        <br />
                        <div className="messageContent">
                          Message: {message.content}
                        </div>
                        <br />
                      </div>
                    ))}
                </>
              </div>
            </div>
          </div>
          <div className="row pt-4">
            <div className="col text-center">
              <input
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                type="text"
                maxLength={128}
                className="rounded-3 input-field-chat"
                placeholder="Send a message..."
              ></input>
              <button type="button" onClick={handleSendMessage}>
                Send
              </button>
              {/* onChange={event => setInput(event.target.value)} */}
              {/* onKeyDown={handleKeyDown} */}
            </div>
          </div>
        </div>
        <div className="col-2 rounded-4 blue-box-chat">
          <div className="row mt-2">
            <div className="col">
              <p className="blue-titles center-position titles-position">
                MEMBERS
              </p>
              <>
                {!isEmpty(currentChannel) &&
                  currentChannel.users?.map((user: UserOnChannel) => (
                    <div key={user.userId}>
                      {allUsers && allUsers[user.userId]?.username}
                    </div>
                  ))}
              </>
            </div>
          </div>
          <div className="row">
            <div className="col overflow-auto">
              <table>
                <tbody>
                  <tr>
                    <td>User</td>
                    <td>
                      <button
                        className="rounded-4 dropdown-toggle color-dropdown channel-button "
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></button>
                      <ul className="dropdown-menu channel-menu text-center">
                        <li className="dropdown-item">Mute</li>
                        <li className="dropdown-item">Ban</li>
                        <li className="dropdown-item">Kick</li>
                        <li className="dropdown-item">Block</li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
