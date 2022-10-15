import React, { useEffect, useState } from "react";
import "./Conversation.css";
import "../../../Components/Tools/Text.css";
import "../../../Components/Tools/Box.css";
import Dialogue from "./Dialogue";
import { isEmpty, otherUser, getUserOnChannel } from "../utils";
import { eChannelType } from "../constants";
import { UserOnChannel } from "../entities/user.entity";

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
  const self = user?.channels?.find(
    (userOnChan: UserOnChannel) => userOnChan?.channelId === currentChannel.id
  );

  const onPressEnter = (e: any) => {
    if (e.key === "Enter") {
      handleSendMessage(e);
    }
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
          <div className="row mt-2 d-flex justify-content-start">
            <div className="col-5">
              <p className="blue-titles" style={{ fontSize: "13px" }}>
                {currentChannel.type !== eChannelType.DIRECT
                  ? "@" + currentChannel.name
                  : `Direct with ` +
                      otherUser(
                        currentChannel.id,
                        allChannels,
                        user.channels,
                        user.id,
                        allUsers
                      )?.username || "loading"}
              </p>
              {self?.role === "ADMIN" || self?.role === "OWNER" ? (
                <div className="yellow-titles" style={{ fontSize: "13px" }}>
                  {self?.role}
                </div>
              ) : (
                <div className="blue-titles" style={{ fontSize: "13px" }}>
                  {self?.role}
                </div>
              )}
            </div>
            <div className="col-7 d-flex justify-content-end align-items-center">
              {currentChannel?.type !== eChannelType.DIRECT ? (
                <button
                  className="btn btn-leave me-2 "
                  style={{ fontSize: "12px" }}
                  onClick={(e) => leaveChannel(currentChannel.id)}
                >
                  <div className="textPink d-flex justify-content-center">
                    Leave
                  </div>
                </button>
              ) : (
                <></>
              )}
              <div>
                {self?.role === "OWNER" &&
                currentChannel?.type !== eChannelType.DIRECT ? (
                  <button
                    className="btn btn-leave me-2 "
                    style={{ fontSize: "12px" }}
                    onClick={() => handleShowPassworChannel()}
                  >
                    <div className="textPink d-flex justify-content-center">
                      Password
                    </div>
                  </button>
                ) : (
                  <> </>
                )}
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
          <div className="border-blue" />
          <div className="row" style={{ height: "15%" }}>
            <div className="col-12 text-center align-self-center ">
              {getUserOnChannel(user?.id, user.channels)?.isMuted || getUserOnChannel(user?.id, currentChannel?.users)?.isMuted ? (
                <div className={"blueText"}>You are muted</div>
              ) : (
                <>
                  <input
                    className="rounded-3 input-field-chat w-75 "
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={onPressEnter}
                    value={message}
                    type="text"
                    maxLength={200}
                    placeholder="Send a message..."
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
