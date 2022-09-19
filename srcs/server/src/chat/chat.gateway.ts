import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Socket } from 'socket.io';
import { OnModuleInit, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessageDto, CreateChannelDto, Channel, JoinChannelDto } from './dto';
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
    const userId = this._parseIdCookie(client.handshake.headers.cookie);
    console.log(`This is user id ${userId}`);
    if (userId) {
      // Updating socket id to match the new socket id of the user on refresh
      console.log(`Trying to update user`);
      this.chatService.allClients = this.chatService.allClients.map((user) => {
        console.log(`First user ${user.id}`);
        if (user.id === userId) {
          user.socketId = client.id;
          console.log(`Updating user ${user.id}`);
        }
        return user;
      });
      // adding the user to the list of users
      this.chatService.addUser(client, userId);
    }
    console.log(
      `Client ${client.id} connected to the chat websocket`,
      userId ? `With id ${userId}` : `witout id`,
    );
    console.log(`This is the list of all users`);
    this.chatService.allClients.map((user) =>
      console.log(`${JSON.stringify(user, null, 4)}`),
    );

    client.emit(Events.updateMessages, this.chatService.allMessages);
    client.emit(Events.updateChannels, this.chatService.allChannels);
  }

  handleDisconnect(client: Socket) {
    const user = this.chatService.allClients.find(
      (cli) => cli.socketId === client.id,
    );
    this.chatService.allClients = this.chatService.allClients.filter(
      (cli) => cli.socketId !== client.id,
    );
    console.log(`User ${user.id} disconnected`);
  }

  @SubscribeMessage(Events.sendMessage)
  handleMessage(client: Socket, message: MessageDto) {
    return this.chatService.handleMessage(client, message);
  }

  @SubscribeMessage(Events.joinChannel)
  handleJoinChannel(client: Socket, channel: JoinChannelDto) {
    console.log(`This is channel joining ${JSON.stringify(channel, null, 4)}`);
    return this.chatService.handleJoinChannel(client, channel);
  }

  @SubscribeMessage(Events.setId)
  handleSetId(client: Socket) {
    const userId = this._parseIdCookie(client.handshake.headers.cookie);
    return this.chatService.handleSetId(client, userId);
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

  private _parseIdCookie(cookies) {
    if (cookies) {
      const cookiesObj = Cookie.parse(cookies);
      if (cookiesObj['id']) return cookiesObj['id'].split('=')[1];
    }
    return null;
  }
}
