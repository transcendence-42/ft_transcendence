import { CreateChannelDto } from "../entities/create-channel.dto";
import { Channel, UserOnChannel  } from "../entities/user.entity";
import { fetchUrl } from "../utils";

const createChannelOnDb = async (
  createChannelDto: CreateChannelDto,
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
