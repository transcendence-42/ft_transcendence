import { Socket } from "socket.io-client";
import { eChannelType, eEvent } from "../constants";
import { CreateChannelDto } from "../entities/create-channel.dto";
import { Channel, UserOnChannel } from "../entities/user.entity";
import createChannelOnDb from "./createChannelOnDb";

const handleCreateChannelForm = (
  e: any,
  name: string,
  type: eChannelType,
  ownerId: number,
  socket: Socket,
  updateOwnUserOnChannel: Function,
  password?: string
) => {
  const channel = (async () => {
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
    const resp: [Channel, UserOnChannel] | void = await createChannelOnDb(
      createChannelDto
    );
    if (!resp) {
      throw new Error("Failed to create user on database");
    }
    updateOwnUserOnChannel(resp[1]);
    if (type !== eChannelType.DIRECT) {
      socket.emit(eEvent.CreateChannel, resp[0].id);
    }
    return resp[0];
  })();
  return channel;
};

export default handleCreateChannelForm;
