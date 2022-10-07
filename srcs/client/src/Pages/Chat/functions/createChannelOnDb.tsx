import { CreateChannelDto } from "../entities/create-channel.dto";
import { Channel, UserOnChannel } from "../entities/user.entity";
import { fetchUrl } from "../utils";

const createChannelOnDb = async (
  createChannelDto: CreateChannelDto
): Promise<[Channel, UserOnChannel] | void> => {
  // API URL
  const apiUrl: string = process.env.REACT_APP_API_URL as string;
  const channel = await fetchUrl(
    `${apiUrl}/channels/`,
    "PUT",
    createChannelDto
  );
  if (channel["id"]) {
    const userOnChannel = await fetchUrl(
      `${apiUrl}/channels/${channel.id}/useronchannel/${channel.ownerId}`,
      "GET"
    );
    return [channel, userOnChannel];
  }
  return alert(`Error while creating channel! ${channel.message}`);
};

export default createChannelOnDb;
