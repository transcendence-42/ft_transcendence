import { Socket } from 'socket.io';

export class Client {
  constructor(socket: Socket, userId: string) {
    this.socket = socket;
    this.userId = userId;
  }

  socket: Socket;
  userId?: string;
  pic?: string;
  name?: string;
}
