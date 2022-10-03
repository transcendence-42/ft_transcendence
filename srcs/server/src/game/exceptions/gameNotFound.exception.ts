import { WsException } from '@nestjs/websockets';

export class GameNotFoundException extends WsException {
  constructor(id: string) {
    super(`Hey ! This game don't exist anymore!`);
  }
}
