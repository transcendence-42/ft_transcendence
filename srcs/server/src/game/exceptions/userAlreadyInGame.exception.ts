import { WsException } from '@nestjs/websockets';

export class UserAlreadyInGameException extends WsException {
  constructor(id: number) {
    super(`User #${id} is already registered in a game`);
  }
}
