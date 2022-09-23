import { Hashtable } from '../interfaces/hashtable.interface';
import { Channel, Message } from './';

export class ChatUser {
  socketId: string;
  id: string;
  name: string;
  profilePicture: string;
  channels?: Hashtable<Channel>;
  directMessges?: Message[];
}
