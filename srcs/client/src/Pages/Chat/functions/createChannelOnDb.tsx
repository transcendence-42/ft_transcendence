import { Channel, CreateChannelDto, UserOnChannel } from "../entities";
import { fetchUrl } from "../utils";
import { eEvent } from "../constants";
import { Socket } from "socket.io-client";

const createChannelOnDb = async (
  createChannelDto: CreateChannelDto,
  socket: Socket
): Promise<[Channel, UserOnChannel] | void> => {
  const channel = await fetchUrl(
    "http://127.0.0.1:4200/channel/",
    "PUT",
    createChannelDto
  );
  if (channel["id"]) {
    const userOnChannel = await fetchUrl(
      `http://127.0.0.1:4200/channel/${channel.id}/useronchannel/${channel.ownerId}`,
      "GET"
    );
    return [channel, userOnChannel];
  }
  return alert(`Error while creating channel! ${channel.message}`);
};

export default createChannelOnDb;
