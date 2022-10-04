import React from "react";
import "../../../Components/Tools/Text.css";
import "../../../Components/Tools/Box.css";
import "../Chat.css";
import ChannelsList from "./ChannelsList";
import ChannelsDropDown from "./ChannelsDropDown";
import DirectList from "./DirectList";
import { UserOnChannel } from "../entities/user.entity";
import { eChannelType } from "../constants";
import { isEmpty, otherUser } from "../utils";

export default function ChannelsAndDirect({
  handleShowBrowseChannel,
  handleShowCreateChannel,
  user,
  allChannels,
  allUsers,
  friends,
  switchChannel,
  handleShowFriendList,
  ...props
}: any) {
  return (
    <div
      className=" rounded-4 blue-box-chat col-3 chat-sidebar-left
      ms-2 overflow-hidden h-100"
    >
      <div className="h-50 overflow-hidden  ">
        <div className="row mt-2  ">
          <div className="col-9 my-sidebar  mt-1">
            <p className="yellow-titles ">CHANNELS</p>
          </div>
          <div className="col-1">
            <ChannelsDropDown
              handleShowBrowseChannel={handleShowBrowseChannel}
              handleShowCreateChannel={handleShowCreateChannel}
            />
          </div>
        </div>
        {/* Div which list the channels */}
        <div className="row h-100">
          <ChannelsList user={user} switchChannel={switchChannel} />
        </div>
      </div>
      {/* Div with the title messages with modals */}
      <div className="messages-div h-50">
        <div className="row">
          <div className="col overflow-auto pt-1">
            <p className="yellow-titles">MESSAGES</p>
          </div>
          <div className="col-1">
            <button
              className="message-button float-end rounded-4 "
              onClick={handleShowFriendList}
            >
              +
            </button>
          </div>
        </div>
        {/* Div with list of users with modals to send messages */}
        <div className="row h-75">
          <DirectList
            user={user}
            switchChannel={switchChannel}
            isEmpty={isEmpty}
            allChannels={allChannels}
            friends={friends}
            allUsers={allUsers}
            otherUser={otherUser}
          />
        </div>
      </div>
    </div>
  );
}
