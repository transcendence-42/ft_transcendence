import { Socket } from "socket.io-client";
import { eChannelType, eEvent } from "../constants";
import { CreateChannelDto, UserOnChannel } from "../entities";
import createChannelOnDb from "./createChannelOnDb";

const handleCreateChannelForm = (
  e: any,
  name: string,
  type: eChannelType,
  ownerId: number,
  socket: Socket,
  updateOwnChannels: Function,
  password?: string
) => {
  console.log("creating a channel");
  e.preventDefault();
  if (name === "") return alert("channel name can't be empty");
  else if (type === eChannelType.PROTECTED && password === "")
    return alert("Password can't be empty!");
  const createChannelDto: CreateChannelDto = {
    name,
    type,
    ownerId,
    password
  };
  const userOnChannel = createChannelOnDb(createChannelDto, socket)
    .then((userOnChannel: UserOnChannel) => {
      if (!userOnChannel) {
        throw new Error("Failed to create user on database");
      }
      updateOwnChannels(userOnChannel);
      socket.emit(eEvent.CreateChannel, userOnChannel.channelId);
      return userOnChannel.channelId;
    })
    .catch((err) => console.log(`${JSON.stringify(err, null, 4)}`));
  return userOnChannel;
};

export default handleCreateChannelForm;
