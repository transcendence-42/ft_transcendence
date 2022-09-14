import { Socket } from 'socket.io';

export class ChatUser {
  socketId: string;
  id: string;
  role: string;
  channels?: string[];
  directMessges?: string[];
}
