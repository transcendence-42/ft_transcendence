import { WsException } from '@nestjs/websockets';

export class UserAlreadyInGameException extends WsException {
  constructor(userId: number) {
    super(`User #${userId} is already registered in a game`);
  }
}
