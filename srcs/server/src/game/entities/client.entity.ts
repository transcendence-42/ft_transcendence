import { Socket } from 'socket.io';

export class Client {
  constructor(socket: Socket, userId: string, name: string, pic: string) {
    this.socket = socket;
    this.userId = userId;
    this.name = name;
    this.pic = pic;
  }
  socket?: Socket;
  userId?: string;
  pic?: string;
  name?: string;
}
