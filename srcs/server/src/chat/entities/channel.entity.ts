import { eChannelType } from '../constants';
import { Message, ChannelUser } from './';
import { Hashtable } from '../interfaces/hashtable.interface';

export class Channel {
  id: string;
  name: string;
  type: eChannelType;
  users: Hashtable<ChannelUser>;
  createdAt: number;
  messages?: Message[];
  password?: string;
}
