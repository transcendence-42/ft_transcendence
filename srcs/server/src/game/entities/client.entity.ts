import { Socket } from 'socket.io';

export class Client {
  constructor(socket: Socket, userId: string) {
    this.socket = socket;
    this.userId = userId;
    this.name = socket.handshake.query.name.toString();
    this.pic = socket.handshake.query.pic.toString();
  }
  socket?: Socket;
  userId?: string;
  pic?: string;
  name?: string;
}
