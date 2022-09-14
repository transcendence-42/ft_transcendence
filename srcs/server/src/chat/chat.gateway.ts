import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { ChatUser } from './chatUser.entity';
import { Payload } from './entities';

@WebSocketGateway(4444, {
  cors: {
    credentials: true,
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  },
})
export class ChatGateway
  implements
    OnModuleInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit
{
  constructor(private readonly chatService: ChatService) {}

  onModuleInit() {
    console.log(`Module Chat is up`);
  }

  afterInit(server: any) {
    this.chatService.server = server;
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client ${client.id} connected to the chat websocket`);
    const user: ChatUser = { socketId: client.id, id: client.id, role: 'user' };
    this.chatService.allClients.push(user);
    client.emit('updateUsers', this.chatService.allClients);
  }

  handleDisconnect(client: any) {
    this.chatService.allClients = this.chatService.allClients.filter(
      (user) => user.socketId !== client.id,
    );
    console.log(`Client ${client.id} disconnected`);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(client: Socket, payload: Payload) {
    return this.chatService.handleMessage(client, payload);
  }

  @SubscribeMessage('joinChannel')
  handleJoinChannel(client: Socket, channel: string) {
    return this.chatService.handleJoinChannel(client, channel);
  }
}
