import { Channel, Message } from './';

export class ChatUser {
  socketId: string;
  id: string;
  name: string;
  profilePicture: string;
  channels?: Channel[];
  directMessges?: Message[];
}
