import React from "react";
import "./Conversation.css";
import { Message } from "../entities";
import "../../../Components/Tools/Text.css";
import "../../../Components/Tools/Box.css";

export default function SendAndReceive({
  currentChannel,
  allMessages,
  user,
  allUsers,
  message,
  ...props
}: any) {
  return (
 <>
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
 </>
  )
}
