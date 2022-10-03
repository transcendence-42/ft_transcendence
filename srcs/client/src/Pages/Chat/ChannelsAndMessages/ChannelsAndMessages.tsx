import React from "react";
import "../../../Components/Tools/Text.css";
import "../../../Components/Tools/Box.css";
import "../Chat.css";
import ChannelsDropDown from "./ChannelsDropDown";
import { UserOnChannel } from "../entities/user.entity";
import { eChannelType } from "../constants";
import { isEmpty, otherUser } from "../utils";

export default function ChannelsAndMessages({
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
          <div className="col-12 h-100 scroll-bar-messages ">
            <table>
              <tbody>
                {user?.channels?.map((usrOnChan: UserOnChannel) =>
                  usrOnChan.channel.type === eChannelType.DIRECT ? (
                    ""
                  ) : (
                    <tr key={usrOnChan.channelId}>
                      <td onClick={(e) => switchChannel(usrOnChan.channelId)}>
                        {usrOnChan.channel.name}
                      </td>
                      <td>

                      </td>
                    </tr>
                  )
                )}
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
                {!isEmpty(allChannels) &&
                  !isEmpty(friends) &&
                  !isEmpty(allUsers) &&
                  !isEmpty(user) &&
                  user?.channels?.map((usrOnChan: UserOnChannel) =>
                    usrOnChan.channel.type !== eChannelType.DIRECT ? (
                      ""
                    ) : (
                      <tr key={usrOnChan.channelId}>
                        <td onClick={(e) => switchChannel(usrOnChan.channelId)}>
                          {otherUser(
                            usrOnChan.channelId,
                            allChannels,
                            user?.channels,
                            user?.id,
                            allUsers
                          )?.username || "loading..."}
                          <button className="rounded-4 btn btn-chat btn-pink">
                            game
                          </button>
                        </td>
                      </tr>
                    )
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
