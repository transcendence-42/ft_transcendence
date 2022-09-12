import { Socket } from 'socket.io';
import { Client } from './client.entity';

export class Player extends Client {
  constructor(socket: Socket, userId: number) {
    super(socket, userId);
    this.score = 0;
    this.updating = false;
  }
  score?: number;
  side?: number;
  updating?: boolean;
}
