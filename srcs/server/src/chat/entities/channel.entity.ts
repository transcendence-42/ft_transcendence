import { ChannelUser } from "./channelUser.entity";

export class Channel {
  id: string;
  name: string;
  type: string;
  usersList: ChannelUser[];
  createdAt: number;
  password?: string;
}
