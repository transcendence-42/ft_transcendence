import { WsException } from '@nestjs/websockets';

export class CannotPauseGameException extends WsException {
  constructor(reason: string) {
    super(`You cannot pause the game : ${reason}.`);
  }
}
