import { Socket } from 'socket.io';
import { Client } from './client.entity';

export class Player extends Client {
  constructor(socket: Socket, userId: string, name: string, pic: string) {
    super(socket, userId, name, pic);
    this.score = 0;
    this.updating = false;
    this.pauseCount = 1;
  }
  score?: number;
  side?: number;
  updating?: boolean;
  pauseCount?: number;
}
