import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayInit,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway(4444, { cors: {} })
export class ChatGateway
  implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client ${client.id} connected to the chat websocket`);
    return 'bidule';
  }
  handleDisconnect(client: any) {
    console.log(`Client ${client.id} disconnected`);
  }
  onModuleInit() {
    console.log(`Module Chat is up`);
  }
  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): string {
    console.log(`Recieved message from socket ${client.id}`);
    return 'Hello world!';
  }
}
