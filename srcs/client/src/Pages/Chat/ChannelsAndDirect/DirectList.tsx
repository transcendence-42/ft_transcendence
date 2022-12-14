import React from "react";
import "../../../Components/Tools/Text.css";
import "../../../Components/Tools/Box.css";
import "../Chat.css";
import { eChannelType } from "../constants";
import { User, UserOnChannel } from "../entities/user.entity";
import DirectsDropDown from "./DirectsDropDown";

export default function DirectList({
  user,
  switchChannel,
  isEmpty,
  allChannels,
  friends,
  allUsers,
  otherUser,
  ...props
}: any) {
  return (
    <>
      <div className="col-12 h-75 overflow-auto scroll-bar-direct">
        <table>
          <tbody>
            {!isEmpty(allChannels) &&
              !isEmpty(friends) &&
              !isEmpty(allUsers) &&
              !isEmpty(user) &&
              user.channels?.map((usrOnChan: UserOnChannel) => {
                if (usrOnChan.channel.type !== eChannelType.DIRECT) {
                  return "";
                }
                let userToDisplay;
                const chan = allChannels.find(
                  (chan) => chan.id === usrOnChan.channelId
                );
                if (chan && chan.users && chan.users.length > 1) {
                  const userOnChannel =
                    chan.users[0].userId === usrOnChan.userId
                      ? chan.users[1]
                      : chan.users[0];
                  userToDisplay = allUsers[userOnChannel.userId];
                }
                return (
                  <tr key={usrOnChan.channelId}>
                    <td onClick={(e) => switchChannel(usrOnChan.channelId)}>
                      <div
                        className="text-start channel"
                        style={{ fontSize: "0.9em" }}
                      >
                        {userToDisplay ? userToDisplay.username : "loading"}
                      </div>
                    </td>
                    {userToDisplay && <DirectsDropDown id={userToDisplay.id} />}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </>
  );
}
