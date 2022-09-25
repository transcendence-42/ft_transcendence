import { Hashtable } from '../interfaces/hashtable.interface';
import { Message } from './';

export class ChatUser {
  id: string;
  socketId: string;
  name: string;
  channelsId?: string[];
  directMessges?: Message[];
}
