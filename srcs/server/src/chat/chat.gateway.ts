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
import { MessageDto, CreateChannelDto } from './dto';
import { Events } from './entities/Events';
import * as Cookie from 'cookie';

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
    // const userId = client.handshake.headers.cookie.split(';')[1];
    const cookies = client.handshake.headers.cookie;
    const cookiesObj = Cookie.parse(cookies);
    const userId = cookiesObj['id']
    console.log(`This is user id ${userId}`);
    if (userId) {
      // Updating socket id to match the new socket id of the user on refresh
      this.chatService.allClients = this.chatService.allClients.map((user) => {
        if (user.id === userId) user.socketId = client.id;
        return user;
      });
      // adding the user to the list of users
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

    // no need to update messages to all clients. Only to the one that just joined
    // this.chatService.server.emit(
    //   Events.updateMessages,
    //   this.chatService.allMessages,
    // );

    client.emit(Events.updateMessages, this.chatService.allMessages);
    client.emit(Events.updateChannels, this.chatService.allChannels);
  }

  handleDisconnect(client: any) {
    // console.log(`Client ${client.id} disconnected`);
  }

  @SubscribeMessage(Events.sendMessage)
  handleMessage(client: Socket, message: MessageDto) {
    return this.chatService.handleMessage(client, message);
  }

  @SubscribeMessage(Events.joinChannel)
  handleJoinChannel(client: Socket, channelName: string) {
    return this.chatService.handleJoinChannel(client, channelName);
  }

  @SubscribeMessage(Events.setId)
  handleSetId(client: Socket) {
    return this.chatService.handleSetId(client);
  }

  @SubscribeMessage(Events.addUser)
  handleAddUser(client: Socket, id: string) {
    return this.chatService.addUser(client, id);
  }

  // @SubscribeMessage('getChannelsList')
  // getChannelsList(client: Socket) {
  // return this.chatService.getChannelsList(client);
  // }

  @SubscribeMessage(Events.createChannel)
  createChannel(client: Socket, channel: CreateChannelDto) {
    console.log(`User creating channel ${JSON.stringify(channel, null, 4)}`);
    return this.chatService.createChannel(client, channel);
  }
}
