import { CreateChannelDto } from "../entities/create-channel.dto";
import { Channel, UserOnChannel } from "../entities/user.entity";
import { fetchUrl } from "../utils";

const createChannelOnDb = async (
  createChannelDto: CreateChannelDto
): Promise<[Channel, UserOnChannel]> => {
  // API URL
  const apiUrl: string = process.env.REACT_APP_API_URL as string;
  console.log(`about to create channel ${createChannelDto.name}`);
  const channel = await fetchUrl(
    `${apiUrl}/channels/`,
    "PUT",
    createChannelDto
  );
  if (channel && channel["id"]) {
    const userOnChannel = await fetchUrl(
      `${apiUrl}/channels/${channel.id}/useronchannel/${channel.ownerId}`,
      "GET"
    );
    return [channel, userOnChannel];
  } else {
    return null;
  }
};

export default createChannelOnDb;
