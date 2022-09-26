import { Socket } from 'socket.io';
import { Client } from './client.entity';

export class Player extends Client {
  constructor(socket: Socket, userId: number) {
    super(socket, userId);
    this.score = 0;
    this.updating = false;
    this.name = socket.handshake.query.name.toString();
    this.pic = socket.handshake.query.pic.toString();
    this.pauseCount = 1;
  }
  score?: number;
  side?: number;
  updating?: boolean;
  pauseCount?: number;

  toJson?(): any {
    return {
      ...super.toJson(),
      score: this.score,
      side: this.side,
      updating: this.updating,
      pauseCount: this.pauseCount,
    };
  }
}
