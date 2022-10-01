import { Socket } from 'socket.io';
import { Client } from './client.entity';

export class Player extends Client {
  constructor(socket: Socket, userId: string) {
    super(socket, userId);
    this.score = 0;
    this.updating = false;
    this.pauseCount = 1;
  }
  score?: number;
  side?: number;
  updating?: boolean;
  pauseCount?: number;
}
