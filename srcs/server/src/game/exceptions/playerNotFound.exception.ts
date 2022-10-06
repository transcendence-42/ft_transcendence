import { WsException } from '@nestjs/websockets';

export class PlayerNotFoundException extends WsException {
  constructor(id: string) {
    super(`Player #${id} not found`);
  }
}
