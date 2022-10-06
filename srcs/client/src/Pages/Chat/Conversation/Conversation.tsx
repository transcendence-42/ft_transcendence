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
  handleShowPassworChannel,
  ...props
}: any) {

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
          <div className="row mt-2 d-flex justify-content-start">
            <div className="col-5">
              <p
                className="blue-titles"
                style={{ fontSize: "15px" }}
              >
                @
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
              className="col btn btn-leave me-2 "
              style={{ fontSize: "12px" }}
              onClick={(e) => leaveChannel(currentChannel.id)}
            >
            <div className="textPink ">Leave</div>
            </button>
            </div>
            <div>
            {
              currentChannel.type === eChannelType.DIRECT ?
              <> </>
              :
              <button
              className="col btn btn-leave me-2 "
              style={{ fontSize: "12px" }}
              onClick={() => handleShowPassworChannel()}
              >
              <div className="textPink ">Password</div>
              </button>
            }
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
