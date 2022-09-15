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
import { ChatUser } from './chatUser.entity';
import { Message } from './entities';
import { v4 as uuidv4 } from 'uuid';

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
    const userId = client.handshake.headers.cookie;
    if (userId) {
      this.chatService.allClients = this.chatService.allClients.map((user) => {
        if (user.id === userId) user.socketId = client.id;
        return user;
      });
      this.chatService.addUser(client, userId);
    }
    console.log(
      `Client ${client.id} connected to the chat websocket`,
      userId ? `With tid ${userId}` : `witout id`,
    );
    console.log(`This is the list of all users`);

    this.chatService.allClients.map((user) =>
      console.log(`This is user ${JSON.stringify(user, null, 4)}`),
    );
    this.chatService.server.emit(
      'updateMessages',
      this.chatService.allMessages,
    );
    client.emit('updateChannels', this.chatService.allChannels);
  }

  handleDisconnect(client: any) {
    // console.log(`Client ${client.id} disconnected`);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(client: Socket, message: Message) {
    return this.chatService.handleMessage(client, message);
  }

  @SubscribeMessage('joinChannel')
  handleJoinChannel(client: Socket, channel: string) {
    return this.chatService.handleJoinChannel(client, channel);
  }

  @SubscribeMessage('setId')
  handleSetId(client: Socket) {
    return this.chatService.handleSetId(client);
  }

  @SubscribeMessage('addUser')
  handleAddUser(client: Socket, id: string) {
    return this.chatService.addUser(client, id);
  }

  @SubscribeMessage('getChannelsList')
  getChannelsList(client: Socket) {
    return this.chatService.getChannelsList(client);
  }

  @SubscribeMessage('createChannel')
  createChannel(client: Socket, channelName: string) {
    console.log(`User creating channel ${channelName}`);
    return this.chatService.createChannel(client, channelName);
  }
}
