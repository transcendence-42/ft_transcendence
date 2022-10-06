import "bootstrap";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "./Chat.css";
import { useState, useEffect, useCallback } from "react";
import { Socket } from "socket.io-client";
import { MessageDto } from "./dtos/message.dto";
import { UpdateChannelDto } from "./dtos/update-channel.dto";
import { Channel, UserOnChannel, User } from "./entities/user.entity";
import { Message } from "./entities/message.entity";
import { Hashtable } from "./entities/entities";
import Conversation from "./Conversation/Conversation";
import Members from "./Members/Members";
import ModalChat from "./Modal/ModalChat";
import ChannelsAndDirect from "./ChannelsAndDirect/ChannelsAndDirect";
import { eEvent, eChannelType, eUserRole } from "./constants";
import { fetchUrl, isEmpty } from "./utils";
import handleCreateChannelForm from "./functions/createChannelForm";
import { UpdateUserOnChannelDto } from "./dtos/update-userOnChannel.dts";
import { UpdateUserDto } from "./dtos/update-user.dto";

export default function Chat(props: any) {
  const socket: Socket = props.socket;
  // const myUserId: number = props.userId;
  const [user, setUser] = useState({} as User);
  const [blockedUsers, setBlockedUsers] = useState({} as Hashtable<boolean>);
  const [allMessages, setAllMessages] = useState({} as Hashtable<Message[]>);
  const [allUsers, setAllUsers] = useState({} as Hashtable<User>);
  const [allChannels, setAllChannels] = useState([] as Channel[]);
  const [currentChannel, setCurrentChannel] = useState({} as Channel);
  const [isUserFetched, setIsUserFetched] = useState<boolean>(false);
  const [message, setMessage] = useState("");
  const [friends, setFriends] = useState([]);

  // state
  const [showBrowseChannel, setShowBrowseChannel] = useState(false);
  const [showCreateChannel, setshowCreateChannel] = useState(false);
  const [showFriendList, setshowFriendList] = useState(false);
  const [showAddToChannel, setShowAddToChannel] = useState(false);
  const [showPassworChannel, setShowPassworChannel] = useState(false);
  const [newChannelPassword, setNewChannelPassword] = useState("");

  // handlers
  const handleCloseCreateChannel = () => setshowCreateChannel(false);
  const handleShowCreateChannel = () => setshowCreateChannel(true);

  const handleCloseBrowseChannel = () => setShowBrowseChannel(false);
  const handleShowBrowseChannel = () => setShowBrowseChannel(true);

  const handleCloseFriendList = () => setshowFriendList(false);
  const handleShowFriendList = () => setshowFriendList(true);

  const handleCloseAddToChannel = () => setShowAddToChannel(false);
  const handleShowAddToChannel = () => setShowAddToChannel(true);

  const handleClosePassworChannel = () => setShowPassworChannel(false);
  const handleShowPassworChannel = () => setShowPassworChannel(true);

  console.group(`Outside useEffects`);
  console.log(`Current channel init is ${JSON.stringify(currentChannel)}`);
  console.log(`Current user on channels ${JSON.stringify(user.channels)}`);
  console.log(`Current all channels ${JSON.stringify(allChannels)}`);
  console.groupEnd();


  const handlePasswordOperation = () => {
    console.log(
      `Changing password for channel ${currentChannel.id} with password ${newChannelPassword}`
    );
    if (!newChannelPassword) {
      return alert("Password cant be empty!");
    }
    if (currentChannel.type === eChannelType.DIRECT) {
      changeChannelPassword(currentChannel.id, newChannelPassword);
    } else {
      setChannelPassword(currentChannel.id, newChannelPassword);
    }
    setNewChannelPassword("");
  };

  const handleGetMessages = useCallback(
    (channelId: number, messages: Message[]) => {
      console.log(
        `GEtting all messages channelid: ${channelId} and messages ${messages}`
      );
      const newAllMessages = allMessages;
      newAllMessages[channelId] = messages;
      setAllMessages({ ...newAllMessages });
      // setAllMessages((prevAllMessages) => {
      //   const newAllMessages = prevAllMessages;
      //   newAllMessages[channelId] = messages;
      //   return { ...newAllMessages };
      // });
    },
    [allMessages]
  );

  // maybe use a useCallback here is better? using allChannels state
  const switchChannel = useCallback(
    (channelId: number | null, channel?: Channel) => {
      console.group("SwitchChannel");
      if (!channelId) {
        console.log(`Switching to empty channel`);
        setCurrentChannel({} as Channel);
        return;
      }
      let switchToChannel;
      if (!channel) {
        switchToChannel = allChannels.find(
          (chan: Channel) => chan.id === channelId
        );
        console.log(
          `trying to switch to channel id ${channelId} and found ${switchToChannel?.id}`
        );
      } else {
        switchToChannel = channel;
      }
      if (switchToChannel) {
        setCurrentChannel(switchToChannel);
        sessionStorage.setItem(
          "currentChannel",
          JSON.stringify(switchToChannel)
        );
      }
      console.groupEnd();
    },
    [allChannels]
  );

  const handleLeaveChannelEvent = useCallback(
    (channelId: number) => {
      console.log(
        `Recieved event leave channel with channel id ${channelId} current channel id is ${
          currentChannel.id
        } ${JSON.stringify(currentChannel)}`
      );
      if (isEmpty(currentChannel) || currentChannel.id === channelId) {
        switchChannel(null);
      }
      socket.emit(eEvent.LeavingChannel, channelId);
    },
    [currentChannel, socket, switchChannel]
  );

  const handleUpdateOneChannel = useCallback(
    (channelId: number) => {
      console.group("UpdateChannelEvent");
      console.log(`All my channels are ${JSON.stringify(allChannels)}`);
      console.log(`all my users in are ${JSON.stringify(allUsers)}`);
      (async () => {
        console.log("recieved event udpateOneChannel");
        console.log(`All my channels are ${JSON.stringify(allChannels)}`);
        const url = "http://127.0.0.1:4200/channels/" + channelId;
        const channel: Channel = await fetchUrl(url);
        updateChannel(channel);
        // if (channel.type === eChannelType.PRIVATE) {
        const isInOwnChannel = channel.users.find(
          (usr) => usr.userId === user.id
        );
        if (isInOwnChannel) {
          const userOnChan = await fetchUrl(
            `http://127.0.0.1:4200/channels/${channel.id}/useronchannel/${user.id}`
          );
          console.log(
            `Upadting ownChannels because the user is in the channel ${userOnChan}`
          );
          updateOwnUserOnChannel(userOnChan);
        }
        console.groupEnd();
      })();
    },
    [allChannels, user, allUsers]
  );
  const createDirect = async (e: any, friendId: number) => {
    console.log(`This is friedn id ${friendId}`);
    const channelName = friendId.toString() + "_" + user.id.toString();
    const newChannel = await handleCreateChannelForm(
      e,
      channelName,
      eChannelType.DIRECT,
      user.id,
      socket,
      updateOwnUserOnChannel
    );
    if (newChannel) {
      sessionStorage.setItem("currentChannel", JSON.stringify(newChannel));
      socket.emit(eEvent.CreateChannel, newChannel.id);
      addToChannel(friendId, newChannel.id);
      setCurrentChannel(newChannel);
      setAllChannels((prevAllChannels) => [...prevAllChannels, newChannel]);
      switchChannel(newChannel.id);
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
        updateOwnUserOnChannel,
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

  const addToChannelAndClose = (userId: number, channelId: number) => {
    //replicate what I did in createDirect and NonDirect as far as emit
    // and updating channels goes.
    (async () => {
      const userOnChannel = await addToChannel(userId, channelId);
      const channel = await fetchUrl(
        `http://127.0.0.1:4200/channels/${channelId}`
      );
      updateChannel(channel);
      updateOwnUserOnChannel(userOnChannel);
      handleCloseAddToChannel();
    })();
  };

  const addToChannel = async (userId: number, channelId: number) => {
    const createUserOnChannelDto = {
      role: eUserRole.USER,
      userId,
      channelId
    };
    // api returns the userOnChannel if hasleftTheChannel ?
    const newUser = await fetchUrl(
      `http://127.0.0.1:4200/channels/${channelId}/useronchannel/`,
      "PUT",
      createUserOnChannelDto
    );
    if (newUser["userId"]) {
      // to be modified later to include a better way of handling error
      socket.emit(eEvent.AddUser, { channelId, userId });
      return newUser;
      // socket.emit(eEvent.UpdateOneChannel, channelId);
    } else {
      //to be changed for a better way of handling error
      return alert(
        `Error while adding user to channel ${JSON.stringify(newUser, null, 4)}`
      );
    }
  };

  const leaveChannel = (channelId: number) => {
    // need to leave socket when leaving channel
    // send a leave channel event and on the backend send a leaveChannel event:
    // then all sockets in userId will emit an event leaving channel
    // and do a client.leave(channel);
    (async () => {
      const userOnChannel = user.channels.find(
        (usrOnChan: UserOnChannel) => usrOnChan.channelId === channelId
      );
      if (userOnChannel.isBanned || userOnChannel.isMuted) {
        const dto: UpdateUserOnChannelDto = {
          hasLeftChannel: true
        };
        const updatedUsrOnChan = await fetchUrl(
          `http://127.0.0.1:4200/channels/${channelId}/useronchannel/${userOnChannel.userId}`,
          "PATCH",
          dto
        );
        if (!updatedUsrOnChan) {
          console.error(
            `Couldn't update channel ${channelId} in leave channel!`
          );
          return;
        }
        updateOwnUserOnChannel(updatedUsrOnChan);
      } else {
        const deleteUser = await fetchUrl(
          `http://127.0.0.1:4200/channels/${channelId}/useronchannel/${userOnChannel.userId}`,
          "delete"
        );
        if (!deleteUser) {
          console.log(
            `Failed to delete user ${JSON.stringify(
              userOnChannel
            )}from channel in leave channel`
          );
        }
        console.log(
          `These are my new OwnChannels before mapping ${JSON.stringify(
            user.channels
          )}`
        );
        setUser((prevUser) => {
          const updatedChannels = prevUser.channels.filter(
            (usrOnChan) => usrOnChan.channelId !== channelId
          );
          console.log(
            `These are my new OwnChannels ${JSON.stringify(updatedChannels)}`
          );
          return { ...prevUser, channels: updatedChannels };
        });
      }
      if (currentChannel.id === channelId) {
        console.log(
          `Trying to find a channel to be in length of channels ${user.channels.length}`
        );
        if (user.channels.length >= 2) {
          const newChan = user.channels.find(
            (usrOnChan: UserOnChannel) =>
              usrOnChan.channelId !== channelId &&
              usrOnChan.hasLeftChannel === false
          );
          console.log(`this is newChan ${newChan}`);
          if (newChan) {
            switchChannel(newChan.channelId);
          }
        } else {
          switchChannel(null);
        }
      }
      socket.emit(eEvent.UpdateOneChannel, channelId);
      socket.emit(eEvent.LeaveChannel, { userId: user.id, channelId });
    })();
  };

  const updateOwnUserOnChannel = (userOnChannel: UserOnChannel) => {
    console.group(`updateOwnUserOnChannel`);
    setUser((prevUser: User) => {
      console.log(
        `Updating own channel. Before all my channels where ${JSON.stringify(
          prevUser.channels
        )}`
      );
      let inOwnChannels = false;
      let updatedChannels: UserOnChannel[] = [];
      updatedChannels = prevUser.channels.map((usrOnChan) => {
        if (usrOnChan.channelId === userOnChannel.channelId) {
          inOwnChannels = true;
          return userOnChannel;
        }
        return usrOnChan;
      });
      if (!inOwnChannels) {
        updatedChannels.push(userOnChannel);
      }
      return { ...prevUser, channels: updatedChannels };
    });
    console.groupEnd();
  };

  const updateChannel = (channel: Channel) => {
    let channelAlreadyExists = false;
    console.group(`UpdateChannels`);
    setAllChannels((prevState) => {
      console.log(`These are all my channels ${JSON.stringify(prevState)}`);
      const newState = prevState.map((chan) => {
        if (chan.id === channel.id) {
          channelAlreadyExists = true;
          return channel;
        }
        return chan;
      });
      if (channelAlreadyExists) {
        newState.push(channel);
      }
      return newState;
    });
    console.groupEnd();
  };

  const handleSendMessage = (e: any) => {
    e.preventDefault();
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

  const setDefaultChannel = (channels, userChannels) => {
    const currChanInLocalStorage =
      window.sessionStorage.getItem("currentChannel");
    console.log(
      `This is channel i got form localStorage ${currChanInLocalStorage} and this is userChannel ${JSON.stringify(
        user.channels
      )}`
    );
    if (currChanInLocalStorage) {
      const channelObject: Channel = JSON.parse(currChanInLocalStorage);
      console.log(`This is channelObj ${JSON.stringify(channelObject)}`);
      console.log(
        `Did i find ${JSON.stringify(
          userChannels.find(
            (userOnChan) => channelObject.id === userOnChan.channelId
          )
        )}`
      );
      const channelInMyChannels = userChannels?.find(
        (usrOnChan) => channelObject.id === usrOnChan.channelId
      );
      if (channelInMyChannels) {
        console.log(`making the switch now`);
        switchChannel(channelObject.id, channelObject);
      }
    }
  };

  //block user
  // ban user
  // muteUser
  const blockUser = useCallback(
    (userId: number) => {
      (async () => {
        console.group("block user");
        console.log(`Blocking user ${userId}`);
        const url = `http://127.0.0.1:4200/users/${userId}`;
        const dto: UpdateUserDto = { blockedUsersIds: user.blockedUsersIds };
        dto.blockedUsersIds.push(userId);
        console.log(`this is the dto im sending ${JSON.stringify(dto)}`);
        await fetchUrl(url, "PATCH", dto);
        setUser((prevUser) => {
          const newBanList = prevUser.blockedUsersIds;
          newBanList.push(userId);
          return { ...prevUser, blockedUsersIds: newBanList };
        });
        setBlockedUsers((prevBlockedUsers) => {
          const updatedBlockedUsers = prevBlockedUsers;
          updatedBlockedUsers[userId] = true;
          return { ...updatedBlockedUsers };
        });
        console.groupEnd();
      })();
    },
    [user.blockedUsersIds]
  );

  const banUser = useCallback((userId: number, channelId: number) => {
    (async () => {
      console.group(`Ban User`);
      console.log(`Now banning poor user ${userId} from channel ${channelId}`);
      const url = `http://127.0.0.1:4200/channels/${channelId}/useronchannel/${userId}`;
      const updatedUser = await fetchUrl(url, "PATCH", {
        isBanned: true,
        hasLeftChannel: true
      } as UpdateUserOnChannelDto);
      socket.emit(eEvent.BanUser, { userId, channelId });
      console.groupEnd();
    })();
  }, []);

  const muteUser = (userId: number, channelId: number) => {
    (async () => {
      console.log(
        `On mute user all mu channels are ${JSON.stringify(allChannels)}`
      );
      console.log(`On mute user all mu users are ${JSON.stringify(allUsers)}`);
      const url = `http://127.0.0.1:4200/channels/${channelId}/useronchannel/${userId}`;
      const mutedUser = await fetchUrl(url, "PATCH", {
        isMuted: true
      } as UpdateUserOnChannelDto);
      if (mutedUser) {
        console.log(`This is the muted user ${JSON.stringify(mutedUser)}`);
        socket.emit(eEvent.MuteUser, {
          userId,
          channelId
        });
      }
    })();
  };

  // update the userOnChannel with isMuted === true;
  // emit an event MutedUser -> which sets a setTimeout of 5 minutes to unmute a user
  // the server then emits an event (update user to all ppl in channel)
  // and another one You have been muted to display a message to the user

  const changeChannelPassword = (channelId: number, newPassword: string) => {
    (async () => {
      const url = `http://127.0.0.1:4200/channels/${channelId}`;
      const dto: UpdateChannelDto = {
        password: newPassword
      };
      const updatedChannel = await fetchUrl(url, "PATCH", dto);
      updateChannel(updatedChannel);
      socket.emit(eEvent.UpdateOneChannel, channelId);
    })();
  };

  const setChannelPassword = (channelId: number, password: string) => {
    (async () => {
      const url = `http://127.0.0.1:4200/channels/${channelId}`;
      const dto: UpdateChannelDto = {
        password,
        type: eChannelType.PROTECTED
      };
      const updatedChannel = await fetchUrl(url, "PATCH", dto);
      updateChannel(updatedChannel);
      socket.emit(eEvent.UpdateOneChannel, channelId);
    })();
  };

  useEffect(() => {
    console.group("Use Effect #1: initChatUser");
    (async () => {
      console.log("fetching auth/success");
      let response = await fetchUrl("http://127.0.0.1:4200/auth/success/");
      console.log(`Fetched /auth/sucess`);
      let { user } = response;
      if (!user) {
        console.log("Gettign another user");
        response = await fetchUrl("http://127.0.0.1:4200/users/2");
        user = response;
      }
      console.log("Setting user");
      setUser(user);
      const blockedUsers: Hashtable<boolean> = {};
      console.log(
        `This is the list of blocked users on init ${JSON.stringify(
          blockedUsers
        )}`
      );
      for (const blockedUser in user.blockedUsersIds) {
        blockedUsers[blockedUser] = true;
      }
      setBlockedUsers(blockedUsers);
      console.log(`${JSON.stringify(user, null, 4)}`);
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
      const channels = await fetchUrl(`http://127.0.0.1:4200/channels`);
      console.log("Fetched channels");

      if (channels) {
        console.log("setting all channels");
        setAllChannels(channels);
        console.log("set all channels");
        setDefaultChannel(channels, user.channels);
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

    socket.on(eEvent.GetMessages, handleGetMessages);

    // socket.on(eEvent.GetMessages, ({ channelId, messages }) => {
    //   console.log(
    //     `GEtting all messages channelid: ${channelId} and messages ${messages}`
    //   );
    //   setAllMessages((prevAllMessages) => {
    //     const newAllMessages = prevAllMessages;
    //     newAllMessages[channelId] = messages;
    //     return { ...newAllMessages };
    //   });
    // });
    socket.on(eEvent.UpdateOneMessage, (message: Message) => {
      console.log(`Updating one message ${JSON.stringify(message)}`);
      setAllMessages((prevAllMessages) => {
        const newAllMessages = prevAllMessages;
        if (!newAllMessages[message.toChannelOrUserId]) {
          newAllMessages[message.toChannelOrUserId] = [];
        }
        console.log(newAllMessages[message.toChannelOrUserId]);
        newAllMessages[message.toChannelOrUserId].push(message);
        return { ...newAllMessages };
      });
    });

    socket.on(eEvent.UpdateOneUser, (userId: number) => {
      (async () => {
        const user = await fetchUrl(`http://127.0.0.1:4200/users/${userId}`);
        setAllUsers((prevState) => {
          const newAllUsers: Hashtable<User> = prevState;
          newAllUsers[userId] = user;
          return { ...newAllUsers };
        });
      })();
    });

    socket.on(eEvent.AddUser, (channelId) => {
      console.log(`RECIEVED EVENT ADDEd TO CHANNEL`);
      socket.emit(eEvent.AddedToChannel, channelId);
    });

    socket.on(eEvent.UpdateOneChannel, handleUpdateOneChannel);

    socket.on(eEvent.UpdateUserOnChannel, (channelId) => {
      (async () => {
        const usrOnChan = await fetchUrl(
          `http://127.0.0.1:4200/channels/${channelId}/useronchannel/${user.id}`
        );
        console.log(`Updating user on channel ${JSON.stringify(usrOnChan)}`);
        updateOwnUserOnChannel(usrOnChan);
      })();
    });

    socket.on(eEvent.JoinChannelResponse, ({ message, userOnChannel }) => {
      if (!userOnChannel) {
        return alert(`failed to join channel ${message}`);
      }
      updateOwnUserOnChannel(userOnChannel);
    });

    socket.on(eEvent.MuteUser, (message) => {
      alert(`${message}`);
    });

    socket.on(eEvent.LeaveChannel, handleLeaveChannelEvent);
    // socket.emit(eEvent.LeavingChannel, channelId);

    socket.on(eEvent.BanUser, (message) => {
      return alert(message);
    });

    console.groupEnd();
    return () => {
      socket.off("connect");
      socket.off(eEvent.UpdateMessages);
      socket.off(eEvent.GetMessages);
      socket.off(eEvent.UpdateOneMessage);
      socket.off(eEvent.UpdateOneUser);
      socket.off(eEvent.AddUser);
      socket.off(eEvent.UpdateOneChannel);
      socket.off(eEvent.UpdateUserOnChannel);
      socket.off(eEvent.JoinChannelResponse);
      socket.off(eEvent.MuteUser);
      socket.off(eEvent.LeavingChannel);
    };
  }, [isUserFetched]);

  return (
    <>
      <div className="container-fluid h-75">
        <div className="row main justify-content-center ms-2 ">
          {allChannels && (
            <>
              <ChannelsAndDirect
                handleShowBrowseChannel={handleShowBrowseChannel}
                handleShowCreateChannel={handleShowCreateChannel}
                user={user}
                allUsers={allUsers}
                allChannels={allChannels}
                friends={friends}
                switchChannel={switchChannel}
                handleShowFriendList={handleShowFriendList}
              />
              <Conversation
                allChannels={allChannels}
                currentChannel={currentChannel}
                allMessages={allMessages}
                leaveChannel={leaveChannel}
                allUsers={allUsers}
                user={user}
                setMessage={setMessage}
                message={message}
                handleSendMessage={handleSendMessage}
                handleShowAddToChannel={handleShowAddToChannel}
                handleCloseAddToChannel={handleCloseAddToChannel}
                handleShowPassworChannel = {handleShowPassworChannel}
                setChannelPassword={setChannelPassword}
                changeChannelPassword={changeChannelPassword}
                blockedUsers={blockedUsers}
              />
              {user && user.channels && (
                <Members
                  currentChannel={currentChannel}
                  allUsers={allUsers}
                  allChannels={allChannels}
                  user={user}
                  muteUser={muteUser}
                  banUser={banUser}
                  blockUser={blockUser}
                  blockedUsers={blockedUsers}
                  handleShowAddToChannel ={handleShowAddToChannel}
                />
              )}
            </>
          )}
        </div>
      </div>
      {/* MODAL */}
      <ModalChat
        user={user}
        friends={friends}
        allChannels={allChannels}
        socket={socket}
        updateOwnUserOnChannel={updateOwnUserOnChannel}
        switchChannel={switchChannel}
        showBrowseChannel={showBrowseChannel}
        handleCloseBrowseChannel={handleCloseBrowseChannel}
        showCreateChannel={showCreateChannel}
        handleCloseCreateChannel={handleCloseCreateChannel}
        showFriendList={showFriendList}
        handleCloseFriendList={handleCloseFriendList}
        createDirect={createDirect}
        createNonDirectChannel={createNonDirectChannel}
        addToChannel={addToChannelAndClose}
        handleCloseAddToChannel={handleCloseAddToChannel}
        handleShowAddToChannel={handleShowAddToChannel}
        showAddToChannel={showAddToChannel}
        currentChannel={currentChannel}
        changeChannelPassword = {changeChannelPassword}
        setChannelPassword = {setChannelPassword}
        showPassworChannel = {showPassworChannel}
        handleClosePassworChannel = {handleClosePassworChannel}
        handlePasswordOperation = {handlePasswordOperation}
        newChannelPassword = {newChannelPassword}
        setNewChannelPassword = {setNewChannelPassword}
      />
    </>
  );
}



