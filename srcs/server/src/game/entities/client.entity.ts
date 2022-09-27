import { Socket } from 'socket.io';

export class Client {
  constructor(socket: Socket, userId: number) {
    this.socket = socket;
    this.userId = userId;
  }

  socket: Socket;
  userId?: number;
  pic?: string;
  name?: string;

  toJson?(): any {
    return {
      userId: this.userId,
      pic: this.pic,
      name: this.name,
    };
  }
}
