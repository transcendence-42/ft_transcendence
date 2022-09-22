import { WsException } from '@nestjs/websockets';

export class UserAlreadyInGameException extends WsException {
  constructor(id: string) {
    super(`User #${id} is already registered in a game`);
  }
}
