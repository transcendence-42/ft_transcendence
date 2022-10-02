import "bootstrap";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "./Chat.css";
import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import ChannelsMessages from "./ChannelsMessages/ChannelsMessages"
import Conversation from "./Conversation/Conversation"
import Members from "./Members/Members"
import ModalChat from "./Modal/ModalChat"
import {
  MessageDto,
  Channel,
  JoinChannelDto,
  Message,
  UserOnChannel,
  Hashtable,
  User,
} from "./entities";
import { eEvent, eChannelType, eUserRole } from "./constants";
import { fetchUrl } from "./utils";
import handleCreateChannelForm from "./functions/createChannelForm";

const isEmpty = (obj: any) => {
  for (const i in obj) return false;
  return true;
};

const lobbyChannel: Channel = {
  name: "lobby",
  type: eChannelType.PUBLIC,
  id: 24098932842,
  users: [],
};

export default function Chat(props: any) {
  const socket: Socket = props.socket;
  const myUserId: number = props.userId;
  const currChanInLocalStorage =
    window.sessionStorage.getItem("currentChannel");
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
  const [isUserFetched, setIsUserFetched] = useState<boolean>(false);
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
    const newChannel = await handleCreateChannelForm(
      e,
      channelName,
      eChannelType.DIRECT,
      userId,
      socket,
      updateOwnChannels
    );
    if (newChannel) {
      handleAddToChannel(friendId, newChannel.id);
      handleCloseFriendList();
    } else return alert(`couldnt create channel with user ${friendId}`);
  };

  const createNonDirectChannel = (
    e: any,
    name: string,
    type: eChannelType,
    ownerId: number,
    password?: string
  ) => {
    (async () => {
      const channel = await handleCreateChannelForm(
        e,
        name,
        type,
        ownerId,
        socket,
        updateOwnChannels,
        password
      );
      console.log(`heres channel created`, channel);
      if (channel) {
        sessionStorage.setItem("currentChannel", JSON.stringify(channel));
        setCurrentChannel(channel);
        setAllChannels((prevAllChannels) => [...prevAllChannels, channel]);
        switchChannel(channel.id);
        handleCloseCreateChannel();
      }
    })();
  };

  const handleAddToChannel = async (userId: number, channelId: number) => {
    const createUserOnChannelDto = {
      role: eUserRole.USER,
      userId,
      channelId,
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
    if (channel) {
      setCurrentChannel(channel);
      sessionStorage.setItem("currentChannel", JSON.stringify(channel));
    }
  };

  const updateOwnChannels = (userOnChannel: UserOnChannel) => {
    let updateAllChannels: UserOnChannel[] = [];
    if (user["channels"]) {
      updateAllChannels = user.channels;
    }
    updateAllChannels.push(userOnChannel);
    setUser((prevUser: User) => ({
      ...prevUser,
      channels: updateAllChannels,
    }));
  };

  const addChannel = (channel: any) => {
    const updatedChannels: Channel[] = allChannels;
    console.log(`Here are all channels before updating ${user.channels}`);
    updatedChannels.push(channel);
    setAllChannels(updatedChannels);
  };

  const handleSendMessage = (e: any) => {
    e.preventDefault();
    if (message === "") return;
    const messageToSend: MessageDto = {
      content: message,
      toChannelOrUserId: currentChannel.id,
      fromUserId: user.id,
    };
    console.log("Emitting message", JSON.stringify(messageToSend, null, 4));
    socket.emit(eEvent.SendMessage, messageToSend);
    setMessage("");
  };
  // to do: handleJoinChannel
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
      password: channelDto.password,
    });
    console.log(
      `This is join channel dto ${JSON.stringify(channelDto, null, 4)}`
    );
    setJoinChannelPassword("");
  };

  useEffect(() => {
    console.group("Use Effect #1: initChatUser");
    (async () => {
      console.log("fetching auth/success");
      const response = await fetchUrl("http://127.0.0.1:4200/auth/success/");
      console.log(`Fetched /auth/sucess`);
      const { user } = response;
      console.log("Setting user");
      setUser(user);
      console.log("setting user is fetched");
      setIsUserFetched(true);
      if (user && user.id) {
        console.log("fetching friends");
        const friends = await fetchUrl(
          `http://127.0.0.1:4200/users/${user.id}/friends`
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
      const channels = await fetchUrl(`http://127.0.0.1:4200/channel`);
      console.log("Fetched channels");

      if (channels) {
        console.log("setting all channels");
        setAllChannels(channels);
        console.log("set all channels");
      }
      // const users = await fetchUrl(`http://127.0.0.1:4200/users/`, "GET");
      console.log("Fetching all users");
      const users = await fetchUrl(`http://127.0.0.1:4200/users/`);
      if (users) {
        const userHashTable: Hashtable<User> = {};
        console.log("Fetched  all users");
        for (const user of users) {
          userHashTable[user.id] = user;
        }
        console.log(`finished fetching uers and user hash`);
        console.log("Setting all users");
        setAllUsers(userHashTable);
        console.log("Trying to connect to server");
      }
      socket.auth = { id: user.id.toString() };
      socket.connect();
      console.groupEnd();
    })();
    console.log(
      `user after async initChatUser() ${JSON.stringify(user, null, 4)}`
    );
  }, []);

  useEffect(() => {
    if (!isUserFetched) return;
    console.group("Use Effect #2 Events");
    console.log("Second useEffect");
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
        socket.emit(eEvent.InitConnection, channelIds);
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
      if (!newAllMessages[message.toChannelOrUserId]) {
        newAllMessages[message.toChannelOrUserId] = [];
      }
      console.log(newAllMessages[message.toChannelOrUserId]);
      newAllMessages[message.toChannelOrUserId].push(message);
      setAllMessages((prevAllMessages) => ({ ...newAllMessages }));
    });

    socket.on(eEvent.UpdateOneUser, (userId: number) => {
      (async () => {
        const newAllUsers: Hashtable<User> = allUsers;
        const user = await fetchUrl(`http://127.0.0.1:4200/users/${userId}`);
        newAllUsers[userId] = user;
        setAllUsers(newAllUsers);
      })();
    });

    socket.on(eEvent.UpdateOneChannel, (channelId) => {
      console.log("recieved event udpateOneChannel");
      (async () => {
        const url = "http://127.0.0.1:4200/channel/" + channelId;
        const channel = await fetchUrl(url);
        addChannel(channel);
      })();
    });

    console.groupEnd();
    return () => {
      socket.off("connect");
      socket.off(eEvent.UpdateMessages);
      socket.off(eEvent.UpdateOneMessage);
      socket.off(eEvent.UpdateOneUser);
      socket.off(eEvent.InitConnection);
      socket.off(eEvent.SetId);
    };
  }, [isUserFetched]);

  return (
    <>
      <div className="container-fluid h-75">
        <div className="row main justify-content-center ms-2 ">
          <ChannelsMessages
            handleShowBrowseChannel = {handleShowBrowseChannel}
            handleShowCreateChannel = {handleShowCreateChannel}
            user = {user}
            switchChannel = {switchChannel}
            handleShowFriendList = {handleShowFriendList}
            />
          <Conversation
            currentChannel = {currentChannel}
            allMessages = {allMessages}
            allUsers = {allUsers}
            user = {user}
            setMessage = {setMessage}
            message = {message}
            handleSendMessage = {handleSendMessage}
            />
          <Members
            currentChannel = {currentChannel}
            allUsers = {allUsers}
            isEmpty = {isEmpty}
            />
        </div>
      </div>
      {/* MODAL */}
      <ModalChat
        user = {user}
        friends = {friends}
        allChannels = {allChannels}
        showBrowseChannel = {showBrowseChannel}
        handleCloseBrowseChannel = {handleCloseBrowseChannel}
        showCreateChannel = {showCreateChannel}
        handleCloseCreateChannel = {handleCloseCreateChannel}
        showFriendList = {showFriendList}
        handleCloseFriendList = {handleCloseFriendList}
        setCreateDirectid = {setCreateDirectid}
        createDirect = {createDirect}
        createNonDirectChannel = {createNonDirectChannel}
        />
    </>
  );
}
