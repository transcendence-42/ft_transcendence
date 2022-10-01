import { Socket } from "socket.io-client";
import { eChannelType, eEvent } from "../constants";
import { Channel, CreateChannelDto, UserOnChannel } from "../entities";
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
  const channel = (async () => {
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
    const resp: [Channel, UserOnChannel] | void = await createChannelOnDb(
      createChannelDto,
      socket
    );
    if (!resp) {
      throw new Error("Failed to create user on database");
    }
    updateOwnChannels(resp[1]);
    socket.emit(eEvent.CreateChannel, resp[0].id);
    return resp[0];
  })();
  return channel;
};

export default handleCreateChannelForm;
