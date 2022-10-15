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
import * as Bcrypt from "bcryptjs";

export default function Chat(props: any) {
  const socket: Socket = props.socket;
  const userID: number = props.userID;
  const apiUrl: string = process.env.REACT_APP_API_URL as string;

  const [user, setUser] = useState({} as User);
  const [blockedUsers, setBlockedUsers] = useState({} as Hashtable<boolean>);
  const [allMessages, setAllMessages] = useState({} as Hashtable<Message[]>);
  const [allUsers, setAllUsers] = useState({} as Hashtable<User>);
  const [allChannels, setAllChannels] = useState([] as Channel[]);
  const [currentChannel, setCurrentChannel] = useState({} as Channel);
  const [isUserFetched, setIsUserFetched] = useState<boolean>(false);
  const [message, setMessage] = useState("");
  const [friends, setFriends] = useState([]);

  const [showBrowseChannel, setShowBrowseChannel] = useState(false);
  const [showCreateChannel, setshowCreateChannel] = useState(false);
  const [showFriendList, setshowFriendList] = useState(false);
  const [showAddToChannel, setShowAddToChannel] = useState(false);
  const [showPassworChannel, setShowPassworChannel] = useState(false);
  const [newChannelPassword, setNewChannelPassword] = useState("");

  /*
   * Handlers for opening and closing modals
   */
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

  const handlePasswordOperation = () => {
    if (!newChannelPassword) {
      return alert("Password cant be empty!");
    }
    changeChannelPassword(currentChannel.id, newChannelPassword);
    handleClosePassworChannel();
    setNewChannelPassword("");
  };

  const handleGetMessages = useCallback(
    (channelId: number, messages: Message[]) => {
      const newAllMessages = allMessages;
      newAllMessages[channelId] = messages;
      setAllMessages({ ...newAllMessages });
    },
    [allMessages]
  );

  const handleUpdateChannels = useCallback(() => {
    (async () => {
      const channels: Channel[] = await fetchUrl(`${apiUrl}/channels/`);
      const updatedUser = await fetchUrl(`${apiUrl}/users/${user.id}`);
      if (channels) {
        setAllChannels([...channels]);
      } else {
        setAllChannels([]);
      }
      setUser({ ...updatedUser });
    })();
  }, [user, apiUrl]);

  const updateCurrentChannel = useCallback((channel: Channel) => {
    setCurrentChannel((prevState) => ({ ...channel }));
  }, []);

  const switchChannel = useCallback(
    (channelId: number | null, channel?: Channel) => {
      if (!channelId) {
        setCurrentChannel({} as Channel);
        return;
      }
      let switchToChannel;
      if (!channel) {
        switchToChannel = allChannels.find(
          (chan: Channel) => chan.id === channelId
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
    },
    [allChannels]
  );

  const updateOwnUserOnChannel = useCallback(
    (userOnChannel: UserOnChannel, toDelete?: boolean) => {
      setUser((prevUser: User) => {
        let inOwnChannels = false;
        let updatedChannels: UserOnChannel[] = [];
        if (toDelete === true) {
          updatedChannels = prevUser.channels.filter(
            (usrOnChan) => usrOnChan.channelId !== userOnChannel.channelId
          );
        }
        updatedChannels = prevUser.channels.map((usrOnChan) => {
          if (usrOnChan.channelId === userOnChannel.channelId) {
            inOwnChannels = true;
            return userOnChannel;
          }
          return usrOnChan;
        });
        if (!inOwnChannels && !toDelete) {
          updatedChannels.push(userOnChannel);
        }
        return { ...prevUser, channels: [...updatedChannels] };
      });
    },
    []
  );
  const handleLeaveChannelEvent = useCallback(
    (channelId: number) => {
      socket.emit(eEvent.LeavingChannel, channelId);
    },
    [socket]
  );

  const updateChannel = useCallback(
    (channel: Channel) => {
      let channelAlreadyExists = false;
      const newState = allChannels.map((chan) => {
        if (chan.id === channel.id) {
          channelAlreadyExists = true;
          return channel;
        }
        return chan;
      });
      if (!channelAlreadyExists) {
        newState.push(channel);
      }
      setAllChannels([...newState]);
    },
    [allChannels]
  );

  const handleUpdateOneChannel = useCallback(
    (channelId: number) => {
      (async () => {
        const url = `${apiUrl}/channels/${channelId}`;
        const channel: Channel = await fetchUrl(url);
        updateChannel(channel);
        if (channel.id === currentChannel.id) {
          updateCurrentChannel(channel);
        }
        const isInOwnChannel = channel.users.find(
          (usr) => usr.userId === user.id
        );
        if (isInOwnChannel) {
          const userOnChan = await fetchUrl(
            `${apiUrl}/channels/${channel.id}/useronchannel/${user.id}`
          );
          updateOwnUserOnChannel(userOnChan);
        }
      })();
    },
    [
      user,
      updateChannel,
      updateOwnUserOnChannel,
      apiUrl,
      currentChannel.id,
      updateCurrentChannel
    ]
  );
  const createDirect = async (e: any, friendId: number) => {
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
      handleUpdateChannels();
      switchChannel(newChannel.id);
      handleCloseFriendList();
    } else return alert(`couldnt create channel with user ${friendId}`);
  };

  const createNonDirectChannel = useCallback(
    (
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
        if (channel) {
          sessionStorage.setItem("currentChannel", JSON.stringify(channel));
          setCurrentChannel(channel);
          setAllChannels((prevAllChannels) => [...prevAllChannels, channel]);
          switchChannel(channel.id);
          handleCloseCreateChannel();
        }
      })();
    },
    [socket, switchChannel, updateOwnUserOnChannel]
  );

  const addToChannel = useCallback(
    (userId: number, channelId: number) => {
      return (async () => {
        const createUserOnChannelDto = {
          role: eUserRole.USER,
          userId,
          channelId
        };
        const newUser = await fetchUrl(
          `${apiUrl}/channels/${channelId}/useronchannel/`,
          "PUT",
          createUserOnChannelDto
        );
        if (newUser["userId"]) {
          socket.emit(eEvent.AddUser, { channelId, userId });
          // handleUpdateChannels();
          return newUser;
        }
      })();
    },
    [apiUrl, socket]
  );

  const addToChannelAndClose = useCallback(
    (userId: number, channelId: number) => {
      (async () => {
        const userOnChannel = await addToChannel(userId, channelId);
        const channel = await fetchUrl(`${apiUrl}/channels/${channelId}`);
        updateChannel(channel);
        updateOwnUserOnChannel(userOnChannel);
        handleCloseAddToChannel();
      })();
    },
    [apiUrl, addToChannel, updateOwnUserOnChannel, updateChannel]
  );

  const leaveChannel = useCallback(
    (channelId: number) => {
      (async () => {
        const userOnChannel = user.channels.find(
          (usrOnChan: UserOnChannel) => usrOnChan.channelId === channelId
        );
        if (userOnChannel.isBanned || userOnChannel.isMuted) {
          const dto: UpdateUserOnChannelDto = {
            hasLeftChannel: true
          };
          const updatedUsrOnChan = await fetchUrl(
            `${apiUrl}/channels/${channelId}/useronchannel/${userOnChannel.userId}`,
            "PATCH",
            dto
          );
          if (!updatedUsrOnChan) {
            return;
          }
        } else {
          await fetchUrl(
            `${apiUrl}/channels/${channelId}/useronchannel/${userOnChannel.userId}`,
            "delete"
          );
        }
        switchChannel(null);
        socket.emit(eEvent.UpdateChannels);
        socket.emit(eEvent.LeaveChannel, { userId: user.id, channelId });
      })();
    },
    [apiUrl, socket, switchChannel, user.channels, user.id]
  );

  const handleSendMessage = (e: any) => {
    e.preventDefault();
    if (message === "") return;
    const messageToSend: MessageDto = {
      content: message,
      toChannelOrUserId: currentChannel.id,
      fromUserId: user.id
    };
    socket.emit(eEvent.SendMessage, messageToSend);
    setMessage("");
  };

  const setDefaultChannel = (channels, userChannels) => {
    const currChanInLocalStorage =
      window.sessionStorage.getItem("currentChannel");
    if (currChanInLocalStorage) {
      const channelObject: Channel = JSON.parse(currChanInLocalStorage);
      const channelInMyChannels = userChannels?.find(
        (usrOnChan) => channelObject.id === usrOnChan.channelId
      );
      if (channelInMyChannels) {
        switchChannel(channelObject.id, channelObject);
      }
    }
  };

  const blockUser = useCallback(
    (userId: number) => {
      (async () => {
        const url = `${apiUrl}/users/${user.id}`;
        const dto: UpdateUserDto = { blockedUsersIds: user.blockedUsersIds };
        dto.blockedUsersIds.push(userId);
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
      })();
    },
    [user, apiUrl]
  );

  const banUser = useCallback(
    (userId: number, channelId: number) => {
      (async () => {
        const url = `${apiUrl}/channels/${channelId}/useronchannel/${userId}`;
        await fetchUrl(url, "PATCH", {
          isBanned: true,
          hasLeftChannel: true
        } as UpdateUserOnChannelDto);
        socket.emit(eEvent.BanUser, { userId, channelId });
      })();
    },
    [socket, apiUrl]
  );

  const changeRole = useCallback(
    (userId: number, channelId: number, role: eUserRole) => {
      (async () => {
        const url = `${apiUrl}/channels/${channelId}/useronchannel/${userId}`;
        const updatedUser = await fetchUrl(url, "PATCH", {
          role
        } as UpdateUserOnChannelDto);
        if (updatedUser) {
          const url = `${apiUrl}/channels/${channelId}`;
          socket.emit(eEvent.UpdateOneChannel, channelId);
          const updatedChannel = await fetchUrl(url);
          updateChannel(updatedChannel);
        }
      })();
    },
    [updateChannel, socket, apiUrl]
  );

  const muteUser = (userId: number, channelId: number) => {
    (async () => {
      const url = `${apiUrl}/channels/${channelId}/useronchannel/${userId}`;
      const mutedUser = await fetchUrl(url, "PATCH", {
        isMuted: true
      } as UpdateUserOnChannelDto);
      if (mutedUser) {
        socket.emit(eEvent.MuteUser, {
          userId,
          channelId
        });
      }
    })();
  };

  const changeChannelPassword = (channelId: number, password: string) => {
    (async () => {
      const url = `${apiUrl}/channels/${channelId}`;
      const hash = await Bcrypt.hash(password, 1);
      const dto: UpdateChannelDto = {
        password: hash,
        type: eChannelType.PROTECTED
      };
      const updatedChannel = await fetchUrl(url, "PATCH", dto);
      updateChannel(updatedChannel);
      socket.emit(eEvent.UpdateOneChannel, channelId);
    })();
  };

  const handleBanUser = useCallback(
    (message: string) => {
      switchChannel(null);
      if (message) {
        return alert(`You have been banned from channel ${message}`);
      }
    },
    [switchChannel]
  );

  const handleJoinChannelResponse = useCallback(
    ({ message, userOnChannel }) => {
      if (!userOnChannel) {
        return alert(`failed to join channel ${message}`);
      }
      updateOwnUserOnChannel(userOnChannel);
    },
    [updateOwnUserOnChannel]
  );

  const handleUpdateUserOnChannel = useCallback(
    (channelId: number) => {
      (async () => {
        const usrOnChan = await fetchUrl(
          `${apiUrl}/channels/${channelId}/useronchannel/${user.id}`
        );
        updateOwnUserOnChannel(usrOnChan);
      })();
    },
    [updateOwnUserOnChannel, apiUrl, user.id]
  );

  const handleMuteUser = useCallback(
    ({ message, channelId }) => {
      const inChannel = user.channels?.find(
        (userOnChan: UserOnChannel) =>
          userOnChan.channelId === channelId &&
          userOnChan.hasLeftChannel === false
      );
      if (inChannel) {
        return alert(message);
      }
    },
    [user]
  );

  const handleUpdateOneMessage = useCallback((message: Message) => {
    setAllMessages((prevAllMessages) => {
      const newAllMessages = prevAllMessages;
      if (!newAllMessages[message.toChannelOrUserId]) {
        newAllMessages[message.toChannelOrUserId] = [];
      }
      newAllMessages[message.toChannelOrUserId].push(message);
      return { ...newAllMessages };
    });
  }, []);

  const handleUpdateOneUser = useCallback(
    (userId: number) => {
      (async () => {
        const user = await fetchUrl(`${apiUrl}/users/${userId}`);
        setAllUsers((prevState) => {
          const newAllUsers: Hashtable<User> = prevState;
          newAllUsers[userId] = user;
          return { ...newAllUsers };
        });
      })();
    },
    [apiUrl]
  );

  /*
   * Init useEfect: This useEffect is only launched once when the component
   * mounts in order to fetch the states
   */
  useEffect(() => {
    if (!user || isEmpty(user)) return;
    const blockedUsers: Hashtable<boolean> = {};
    for (const blockedUser of user.blockedUsersIds) {
      blockedUsers[blockedUser] = true;
    }
    setBlockedUsers(blockedUsers);
  }, [user]);

  useEffect(() => {
    if (!user || isEmpty(user)) return;
    (async () => {
      const friends = await fetchUrl(`${apiUrl}/users/${user.id}/friends`);
      if (friends && friends.length !== 0) {
        setFriends(friends);
      }
    })();
  }, [apiUrl, user]);

  useEffect(() => {
    (async () => {
      if (!userID) return;
      const user = await fetchUrl(`${apiUrl}/users/${userID}`);
      setUser(user);
      setIsUserFetched(true);
      const channels = await fetchUrl(`${apiUrl}/channels`);
      if (channels) {
        setAllChannels(channels);
        setDefaultChannel(channels, user.channels);
      }
      const users = await fetchUrl(`${apiUrl}/users/`);
      if (users) {
        const userHashTable: Hashtable<User> = {};
        for (const user of users) {
          userHashTable[user.id] = user;
        }
        setAllUsers(userHashTable);
      }
      socket.auth = { id: user.id.toString() };
      socket.connect();
    })();
  }, [userID]);

  useEffect(() => {
    if (!userID) return;
    socket.emit(eEvent.AddedToRoom, userID.toString());
  }, [userID, socket]);

  useEffect(() => {
    if (!user) return;
    socket.emit(eEvent.GetMessages);
  }, [socket, user]);

  useEffect(() => {
    if (!isUserFetched || !userID) return;
    socket.on("connect", () => {
      const channelIds: string[] = [];
      if (user.channels) {
        for (const chan of user.channels) {
          channelIds.push(chan.channelId.toString());
        }
        socket.emit(eEvent.InitConnection, channelIds);
      }
    });

    return () => {
      socket.off("connect");
    };
  }, [isUserFetched, userID]);

  useEffect(() => {
    socket.on(eEvent.GetMessages, handleGetMessages);
    socket.on(eEvent.UpdateOneMessage, handleUpdateOneMessage);
    socket.on(eEvent.UpdateOneUser, handleUpdateOneUser);
    socket.on(eEvent.UpdateOneChannel, handleUpdateOneChannel);
    socket.on(eEvent.UpdateUserOnChannel, handleUpdateUserOnChannel);
    socket.on(eEvent.UpdateChannels, handleUpdateChannels);
    socket.on(eEvent.JoinChannelResponse, handleJoinChannelResponse);
    socket.on(eEvent.MuteUser, handleMuteUser);
    socket.on(eEvent.LeaveChannel, handleLeaveChannelEvent);
    socket.on(eEvent.BanUser, handleBanUser);
    socket.on(eEvent.AddUser, (channelId) => {
      socket.emit(eEvent.AddedToChannel, channelId);
    });
    socket.on(eEvent.UpdateMessages, (messages: Hashtable<Message[]>) => {
      setAllMessages(messages);
    });

    return () => {
      socket.off(eEvent.BanUser);
      socket.off(eEvent.MuteUser);
      socket.off(eEvent.UpdateMessages);
      socket.off(eEvent.GetMessages);
      socket.off(eEvent.UpdateOneMessage);
      socket.off(eEvent.UpdateOneUser);
      socket.off(eEvent.AddUser);
      socket.off(eEvent.UpdateOneChannel);
      socket.off(eEvent.UpdateUserOnChannel);
      socket.off(eEvent.JoinChannelResponse);
      socket.off(eEvent.LeaveChannel);
      socket.off(eEvent.LeavingChannel);
      socket.off(eEvent.UpdateChannels);
      socket.off(eEvent.AddedToChannel);
    };
  }, [
    handleUpdateOneChannel,
    handleJoinChannelResponse,
    handleUpdateOneUser,
    handleUpdateOneMessage,
    handleUpdateUserOnChannel,
    handleGetMessages,
    user,
    handleLeaveChannelEvent,
    updateOwnUserOnChannel,
    handleUpdateChannels,
    handleBanUser,
    handleMuteUser,
    apiUrl,
    socket
  ]);

  return (
    <>
      {" "}
      {!userID ? (
        ""
      ) : (
        <>
          <div className="container-fluid h-75">
            <div className="row main justify-content-center ms-2 ">
              {user && allChannels && (
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
                  />{" "}
                  {user?.channels && (
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
                      handleShowPassworChannel={handleShowPassworChannel}
                      changeChannelPassword={changeChannelPassword}
                      blockedUsers={blockedUsers}
                    />
                  )}
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
                      handleShowAddToChannel={handleShowAddToChannel}
                      changeRole={changeRole}
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
            changeChannelPassword={changeChannelPassword}
            showPassworChannel={showPassworChannel}
            handleClosePassworChannel={handleClosePassworChannel}
            handlePasswordOperation={handlePasswordOperation}
            newChannelPassword={newChannelPassword}
            setNewChannelPassword={setNewChannelPassword}
          />
        </>
      )}
    </>
  );
}
