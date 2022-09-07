import { WsException } from '@nestjs/websockets';

export class PlayerNotFoundException extends WsException {
  constructor(userId: number) {
    super(`Player #${userId} not found`);
  }
}
