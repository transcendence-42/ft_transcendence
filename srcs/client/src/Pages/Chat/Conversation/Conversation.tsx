import React from "react";
import { Message } from "../entities";
import "./Conversation.css";
import "../../../Components/Tools/Text.css";
import "../../../Components/Tools/Box.css";

export default function Conversation({
  currentChannel,
  allMessages,
  allUsers,
  user,
  setMessage,
  message,
  handleSendMessage,
  ...props
}: any) {
  return (
    <div
      className="col-6 chat-sidebar-middle
      h-100 rounded-4 blue-box-chat  overflow-hidden ms-2 me-2"
    >
      <div className="row mt-2">
        <div className="col">
          <p
            className="badge bg-warning text-dark"
            style={{ fontSize: "12px" }}
          >
            {currentChannel.name}
          </p>
        </div>
        <div className="col-3 btn btn-leave me-2 " style={{ fontSize: "12px" }}>
          <div className="pinkText ">leave</div>
        </div>
      </div>
      {/* Div with all list of messages */}
      <div className="row h-75 ">
        <div className="col scroll-bar-messages h-100 px-4 ">
          <div className=" ">
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
                    <div className="messageDate text-center text-white">
                      {new Date(message.sentDate).toLocaleString()}
                    </div>
                    <div className="row">
                      <div className="messageFromUser  col-3">
                        {allUsers[message.fromUserId].username || "Pong Bot"}:
                      </div>
                      <div className="col-1"></div>
                      <div
                        style={{ wordWrap: "break-word" }}
                        className="messageContent col text-white pb-5"
                      >
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
            </>
          </div>
        </div>
      </div>

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
    </div>
  );
}
