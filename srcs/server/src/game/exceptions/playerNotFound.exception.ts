import { WsException } from '@nestjs/websockets';

export class PlayerNotFoundException extends WsException {
  constructor(id: number) {
    super(`Player #${id} not found`);
  }
}
