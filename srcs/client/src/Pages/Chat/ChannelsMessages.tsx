import React from "react";
import { UserOnChannel } from "./entities";
import "../../Components/Tools/Text.css";
import "../../Components/Tools/Box.css";

export default function ChannelsMessages({
  handleShowBrowseChannel,
  handleShowCreateChannel,
  user,
  switchChannel,
  handleShowFriendList,
  ...props
}: any) {
  return (
    <div
      className=" rounded-4 blue-box-chat col chat-sidebar-left
					ms-3 overflow-hidden h-100"
    >
      <div className="h-50 overflow-hidden  ">
        <div className="row mt-2  ">
          <div className="col-9 my-sidebar  mt-1">
            <p className="yellow-titles ">CHANNELS</p>
          </div>
          <div className="col-1">
            <button
              className="float-end rounded-4  color-dropdown channel-button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              +
            </button>
            <ul className="dropdown-menu channel-menu">
              <li className="dropdown-item" onClick={handleShowBrowseChannel}>
                Browse channels
              </li>
              <li className="dropdown-item" onClick={handleShowCreateChannel}>
                Create a channel
              </li>
            </ul>
          </div>
        </div>
        {/* Div which list the channels */}
        <div className="row h-100">
          <div className="col-12 h-100 scroll-bar-messages ">
            <table>
              <tbody>
                {user?.channels?.map((usrOnChan: UserOnChannel) => (
                  <tr key={usrOnChan.channelId}>
                    <td onClick={(e) => switchChannel(usrOnChan.channelId)}>
                      {usrOnChan.channel.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
          <div className="col  overflow-auto scroll-bar-direct">
            <table>
              <tbody>
                <tr>
                  <td>User</td>
                  <td>
                    <div className="col-1">
                      <button
                        className="float-end rounded-4 dropdown-toggle color-dropdown channel-button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></button>
                      <ul className="dropdown-menu channel-menu">
                        <li
                          className="dropdown-item"
                          onClick={handleShowBrowseChannel}
                        >
                          Open chat
                        </li>
                        <li
                          className="dropdown-item"
                          onClick={handleShowCreateChannel}
                        >
                          Play a game
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
