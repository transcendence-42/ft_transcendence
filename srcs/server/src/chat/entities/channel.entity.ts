import { eChannelType } from '../constants';
import { Message, ChannelUser } from './';

export class Channel {
  id: string;
  name: string;
  type: eChannelType;
  users: ChannelUser[];
  createdAt: number;
  messages?: Message[];
  password?: string;
}
