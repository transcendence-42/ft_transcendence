import React, { useState } from "react";
import "./Conversation.css";
import "../../../Components/Tools/Text.css";
import "../../../Components/Tools/Box.css";
import Dialogue from "./Dialogue";
import { isEmpty, otherUser, getUserOnChannel } from "../utils";
import { eChannelType } from "../constants";

export default function Conversation({
  currentChannel,
  blockedUsers,
  allMessages,
  allUsers,
  friends,
  allChannels,
  user,
  setMessage,
  message,
  leaveChannel,
  handleSendMessage,
  handleCloseAddToChannel,
  handleShowAddToChannel,
  changeChannelPassword,
  setChannelPassword,
  ...props
}: any) {
  const [newChannelPassword, setNewChannelPassword] = useState("");

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
  return (
    <div
      className="col-6 chat-sidebar-middle
      h-100 rounded-4 blue-box-chat  overflow-hidden ms-2 me-2"
    >
      {isEmpty(currentChannel) ? (
        <div className="row mt-3 ">
          <div className="pinkText"> Join or Create a Channel ! </div>
        </div>
      ) : (
        <>
          <div className="row mt-2">
            <div className="col">
              <p
                className="badge bg-primary bg-darken-xl"
                style={{ fontSize: "12px" }}
              >
                {currentChannel.type !== eChannelType.DIRECT
                  ? currentChannel.name
                  : `Direct with ` +
                      otherUser(
                        currentChannel.id,
                        allChannels,
                        user.channels,
                        user.id,
                        allUsers
                      )?.username || "loading"}
              </p>
            </div>
            <button
              className="col-3 btn btn-leave me-2 "
              style={{ fontSize: "12px" }}
              onClick={(e) => leaveChannel(currentChannel.id)}
              // className="rounded-4 btn btn-chat btn-pink"
            >
              leave
            </button>

            {currentChannel.type === eChannelType.DIRECT ? (
              ""
            ) : (
              <>
                {/* <button
                  onClick={(e) => handlePasswordOperation()}
                  className="col-3 btn btn-leave me-2"
                >
                  Change channel password
                </button> */}
                {/* <input
                  onChange={(e) => setNewChannelPassword(e.target.value)}
                  placeholder="channel Pass"
                ></input> */}
              </>
            )}
            {/* <div className="pinkText ">leave</div> */}
            {/* </div> */}

            <div className="messages-div h-50">
              <div className="row">
                <div className="col-1">
                  {/* <button
                    className="message-button float-end rounded-4 "
                    onClick={handleShowAddToChannel}
                  >
                    add a friend
                  </button> */}
                </div>
              </div>
            </div>
          </div>
          {/* // Div with all list of messages */}
          <Dialogue
            currentChannel={currentChannel}
            allMessages={allMessages}
            user={user}
            allUsers={allUsers}
            message={message}
            blockedUsers={blockedUsers}
          />
          {console.log(
            `inside conv ${JSON.stringify(
              getUserOnChannel(user.id, user.channels)
            )}`
          )}
          <div className="border-blue" />
          <div className="row" style={{ height: "15%" }}>
            <div className="col-12 text-center align-self-center ">
              {getUserOnChannel(user.id, user.channels).isMuted ? (
                <div>You are muted</div>
              ) : (
                <>
                  <input
                    className="rounded-3 input-field-chat w-75 "
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                    type="text"
                    maxLength={50}
                    placeholder="  Send a message..."
                  ></input>
                  <button
                    type="button"
                    className="btn rounded-4 btn-pink btn-join ms-2 mb-1"
                    onClick={handleSendMessage}
                  >
                    Send
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
