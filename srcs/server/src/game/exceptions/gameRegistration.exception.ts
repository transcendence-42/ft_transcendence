import { WsException } from '@nestjs/websockets';

export class gameRegistrationException extends WsException {
  constructor() {
    super(`The game failed to register to the database.`);
  }
}
