import React from "react";
import "../../../Components/Tools/Text.css";
import "../../../Components/Tools/Box.css";
import "../Chat.css";
import { eChannelType } from "../constants";
import { UserOnChannel } from "../entities/user.entity";


export default function ChannelsList({
	user,
	switchChannel,
  ...props
}: any) {
  return (
	<>
	  <div className="col-12 h-100 scroll-bar-messages ">
            <table >
              <tbody>
                {user?.channels?.map((usrOnChan: UserOnChannel) =>
                  usrOnChan.channel.type === eChannelType.DIRECT || usrOnChan.hasLeftChannel ? (
                    ""
                  ) : (
                    <tr key={usrOnChan.channelId}>
                      <td onClick={(e) => switchChannel(usrOnChan.channelId)}
                      className="text-start channel"
                      style={{fontSize:"0.9em"}}
                      >
                        {usrOnChan.channel.name}
                      </td>
                      <td></td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
	</>
  );
}
