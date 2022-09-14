import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway(4444, {
  cors: {
    credentials: true,
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  },
})
export class ChatGateway
  implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly chatService: ChatService) {}

  onModuleInit() {
    console.log(`Module Chat is up`);
  }
  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client ${client.id} connected to the chat websocket`);
    return 'bidule';
  }
  handleDisconnect(client: any) {
    console.log(`Client ${client.id} disconnected`);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): string {
    console.log(
      `Recieved message ${JSON.stringify(payload, null, 4)} from socket ${
        client.id
      }`,
    );
    return 'Hello world!';
  }
}
