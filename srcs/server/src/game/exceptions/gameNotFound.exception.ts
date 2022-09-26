import { WsException } from '@nestjs/websockets';

export class GameNotFoundException extends WsException {
  constructor(id: string) {
    super(`Game #${id} not found`);
  }
}
