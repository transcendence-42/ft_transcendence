import { WsException } from '@nestjs/websockets';

export class gameIsPausedException extends WsException {
  constructor() {
    super(`The game is currently paused. It should continue soon.`);
  }
}
