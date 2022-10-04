import React from "react";
import "../../../Components/Tools/Text.css";
import "../../../Components/Tools/Box.css";
import "../Chat.css";
import { eChannelType } from "../constants";
import { UserOnChannel } from "../entities/user.entity";
import DirectsDropDown from './DirectsDropDown'

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
	<div className="col overflow-auto scroll-bar-direct">
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
                          <div className="text-start channel" style={{fontSize:"0.9em"}}>
						  <DirectsDropDown
						  user = {otherUser(
                            usrOnChan.channelId,
                            allChannels,
                            user?.channels,
                            user?.id,
                            allUsers
                          )?.username || "loading..."}
						  />
                          </div>
                        </td>
                      </tr>
                    )
                  )}
              </tbody>
            </table>
          </div>

	</>
  );
}
