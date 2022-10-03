import React from "react";
import "./Conversation.css";
import "../../../Components/Tools/Text.css";
import "../../../Components/Tools/Box.css";
import Dialogue from "./Dialogue";
import { isEmpty, otherUser } from "../utils";
import { eChannelType } from "../constants";

export default function Conversation({
  currentChannel,
  allMessages,
  allUsers,
  friends,
  allChannels,
  user,
  setMessage,
  message,
  leaveChannel,
  handleSendMessage,
  ...props
}: any) {
  return (
    <div
      className="col-6 chat-sidebar-middle
      h-100 rounded-4 blue-box-chat  overflow-hidden ms-2 me-2"
    >
      {isEmpty(currentChannel) ? (
        <div> Join a Channel! </div>
      ) : (
        <>
          <div className="row mt-2">
            <div className="col">
              <p
                className="badge bg-warning text-dark"
                style={{ fontSize: "12px" }}
              >
                currentChannel:
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
                leave</button>
              {/* <div className="pinkText ">leave</div> */}
            {/* </div> */}
          </div>
          {/* // Div with all list of messages */}
          <Dialogue
            currentChannel={currentChannel}
            allMessages={allMessages}
            user={user}
            allUsers={allUsers}
            message={message}
          />
          <div className="row" style={{ height: "15%" }}>
            <div className="col-12 text-center align-self-center ">
              <input
                className="rounded-3 input-field-chat w-75 "
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                type="text"
                maxLength={50}
                placeholder="Send a message..."
              ></input>
              <button type="button" onClick={handleSendMessage}>
                Send
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
