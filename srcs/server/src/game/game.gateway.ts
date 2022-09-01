import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'dgram';

@WebSocketGateway(4343, { cors: true })
export class GameGateway {
  @SubscribeMessage('connection')
  handleMessage(client: Socket, payload: any): string {
    return 'Hello world!';
  }

  @SubscribeMessage('USER_ONLINE')
  handleUserOnline(client: Socket, payload: any) {
    client.emit('WELCOME');
  }

  @SubscribeMessage('SEND_JOIN_REQUEST')
  handleJoinRequest(client: Socket, payload: any) {
    client.emit('JOIN_REQUEST_ACCEPTED');
  }
}
