import { useState } from "react";
import "./BrowseChannels.css";
import { Channel, UserOnChannel } from "../entities/user.entity";
import { eChannelType, eEvent, eUserRole } from "../constants";
import { fetchUrl } from "../utils";
import { UpdateUserOnChannelDto } from "../dtos/update-userOnChannel.dts";
import { CreateUserOnChannelDto } from "../dtos/create-userOnChannel.dto";

export default function BrowseChannels({
  allChannels,
  userChannels,
  userId,
  socket,
  updateOwnUserOnChannel,
  switchChannel,
  handleCloseBrowseChannel,
  ...props
}: any) {
  const [channelSearch, setChannelSearch] = useState("");
  const [joinChannelPassword, setJoinChannelPassword] = useState("");

  const handleJoinChannel = (e: any, channel: Channel) => {
    e.preventDefault();
    if (
      channel["type"] === eChannelType.PROTECTED &&
      joinChannelPassword === ""
    ) {
      // return alert("You must provide a Password!");
      return <div></div>;
    }
    (async () => {
      const userOnChannel = userChannels?.find(
        (usrChan: UserOnChannel) => usrChan.channelId === channel.id
      );
      let res;
      if (userOnChannel) {
        const payload: UpdateUserOnChannelDto = {
          hasLeftChannel: false
        };
        res = await fetchUrl(
          `http://127.0.0.1:4200/channels/${channel.id}/useronchannel/${userId}`,
          "PATCH",
          payload
        );
        if (!res) {
          console.error(
            `There was an error while upadting channel ${userOnChannel.channelId}`
          );
          return;
        }
      } else {
        const payload: CreateUserOnChannelDto = {
          role: eUserRole.USER,
          userId,
          channelId: channel.id
        };
        res = await fetchUrl(
          `http://127.0.0.1:4200/channels/${channel.id}/useronchannel`,
          "PUT",
          payload
        );
        console.log(
          `this is result from joining channel ${JSON.stringify(res, null, 4)}`
        );
        if (!res) {
          console.error(
            `There was an error creating user on channel in Join Channel inside Browse channel`
          );
          return;
        }
      }
      updateOwnUserOnChannel(res);
      socket.emit(eEvent.JoinChannel, channel.id);
      switchChannel(channel.id);
      handleCloseBrowseChannel();
    })();

  };

  const availableChannels = allChannels?.filter((channel: Channel) => {
    console.log(`Channel type is ${channel.type}`);
    if (
      channel.type === eChannelType.DIRECT ||
      channel.type === eChannelType.PRIVATE
    ) {
      console.log(`returning because channel type is ${channel.type}`);
      return;
    }
    console.log(
      `these are userChannels in browsechannels ${JSON.stringify(
        userChannels,
        null,
        4
      )}`
    );
    const userInChan: UserOnChannel = userChannels?.find(
      (usrChan: UserOnChannel) => usrChan.channelId === channel.id
    );
    if (userInChan && (userInChan.isBanned || !userInChan.hasLeftChannel)) {
      return;
    }
    return channel;
  });

  let filtered: Channel[];
  if (channelSearch) {
    filtered = availableChannels?.filter((channel: Channel) =>
      new RegExp(channelSearch, "i").test(channel.name)
    );
  } else filtered = availableChannels;

  return (
    <div className="row row-color">
      <input
        style={{ color: "black" }}
        value={channelSearch}
        onChange={(e) => setChannelSearch(e.target.value)}
      ></input>
      {filtered ? (
        <>
          {filtered.map((channel: Channel) => (
            <div className="channels" key={channel.id}>
              <div className="col">
                  <table className="table">
                    <tbody>
                      <tr>

                        <td
                          className="channel"
                          aria-expanded="false"
                          data-bs-toggle="collapse"
                          data-bs-target={"#collapseProtected" + channel.id.toString()}
                          aria-controls={"collapseProtected" + channel.id.toString()}
                          onClick={(e) => handleJoinChannel(e, channel)}>

                            <input
                              className="form-check-input"
                              type="radio"
                              name="RadiosBrowseChannels"
                              id="Radios1"
                              value="option1">
                            </input>
                          </td>

                          <td>
                            <label className="form-check-label channel-name-color" htmlFor="Radios1">
                              {channel.name}
                            </label>

                            {channel.type !== eChannelType.PROTECTED ? '' :
                              <div className="collapse" id={"collapseProtected"+ (channel.id).toString()}>
                                <input
                                   type="name"
                                   className="form-control"
                                   placeholder="Password">
                                </input>
                              </div>
                            }
                          </td>
                      </tr>
                    </tbody>
                  </table>
              </div>
            </div>
          ))}{" "}
        </>
      ) : (
        ""
      )}
    </div>
  );
}
