import { WsException } from '@nestjs/websockets';

export class GameNotFoundException extends WsException {
  constructor(gameId: string) {
    super(`Game #${gameId} not found`);
  }
}
