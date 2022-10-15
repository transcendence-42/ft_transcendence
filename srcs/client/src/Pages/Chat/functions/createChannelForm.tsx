import { Socket } from "socket.io-client";
import { eChannelType, eEvent } from "../constants";
import { CreateChannelDto } from "../entities/create-channel.dto";
import { Channel, UserOnChannel } from "../entities/user.entity";
import createChannelOnDb from "./createChannelOnDb";
import * as Bcrypt from "bcryptjs";

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
    let hash: string;
    if (type === eChannelType.PROTECTED) {
      hash = await Bcrypt.hash(password, 1);
    }
    const createChannelDto: CreateChannelDto = {
      name,
      type,
      ownerId,
      password: hash
    };
    const resp: [Channel, UserOnChannel] = await createChannelOnDb(
      createChannelDto
    );
    if (!resp) {
      return alert(`Channel ${name} already exist`);
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
