import { WsException } from '@nestjs/websockets';

export class TooMuchPlayersException extends WsException {
  constructor() {
    super(`Too much players for one game !`);
  }
}
