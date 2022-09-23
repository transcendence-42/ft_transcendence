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
import { MessageDto, CreateChannelDto, JoinChannelDto } from './dto';
import { ChatUser, Channel } from './entities';
import { eEvent } from './constants';
import { Hashtable } from './interfaces/hashtable.interface';

enum REDIS_DB {
  USERS_DB = 1,
  CHANNELS_DB,
  MSG_DB,
}

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
    this.chatService.initBot();
    this.chatService.server = server;
  }

  async handleConnection(client: Socket, ...args: any[]) {
    const userId: string = this.chatService.parseIdCookie(
      client.handshake.headers.cookie,
    );
    console.log(`This is user id ${userId}`);
    if (userId) {
      // Updating socket id to match the new socket id of the user on refresh
      const user: ChatUser = await this.chatService.getObject(
        userId,
        REDIS_DB.USERS_DB,
      );
      console.log(`User ${JSON.stringify(user, null, 4)} reconnected`);
      client.emit(eEvent.AddUserResponse, user);
    } else {
      console.log(
        `Client ${client.id} connected to the chat websocket`,
        userId ? `With id ${userId}` : `witout id`,
      );
    }
    console.log(`This is the list of all users`);
    try {
      const allUsers: Hashtable<ChatUser> =
        await this.chatService.getAllAsHashtable(REDIS_DB.USERS_DB);
      client.emit(eEvent.UpdateUsers, allUsers);
      Object.values(allUsers).map((user) =>
        console.log(`${JSON.stringify(user, null, 4)}`),
      );
    } catch (err) {
      console.log('Currently there are no users');
    }

    try {
      const allChannels: Hashtable<Channel> =
        await this.chatService.getAllAsHashtable(REDIS_DB.CHANNELS_DB);
      client.emit(eEvent.UpdateChannels, allChannels);
    } catch (err) {
      console.log('Currenlty there are no channels');
    }
    const allMessages = await this.chatService.getAllAsArray(REDIS_DB.MSG_DB);
    client.emit(eEvent.UpdateMessages, allMessages);
    // this.chatService.getJson();
  }

  handleDisconnect(client: Socket) {
    console.log(`client ${client.id} disconnected`);
  }

  @SubscribeMessage(eEvent.SendMessage)
  handleMessage(client: Socket, message: MessageDto) {
    return this.chatService.handleMessage(client, message);
  }

  @SubscribeMessage(eEvent.JoinChannel)
  handleJoinChannel(client: Socket, channel: JoinChannelDto) {
    console.log(`This is channel joining ${JSON.stringify(channel, null, 4)}`);
    return this.chatService.handleJoinChannel(client, channel);
  }

  @SubscribeMessage(eEvent.AddedToRoom)
  handleAddedToRoom(client: Socket, channelId: string) {
    return this.chatService.handleAddedToRoom(client, channelId);
  }

  @SubscribeMessage(eEvent.SetId)
  handleSetId(client: Socket) {
    const userId = this.chatService.parseIdCookie(
      client.handshake.headers.cookie,
    );
    return this.chatService.handleSetId(client, userId);
  }

  @SubscribeMessage(eEvent.AddUser)
  handleAddUser(client: Socket, id: string) {
    return this.chatService.addUser(client, id);
  }

  // @SubscribeMessage('getChannelsList')
  // getChannelsList(client: Socket) {
  // return this.chatService.getChannelsList(client);
  // }

  @SubscribeMessage(eEvent.CreateChannel)
  createChannel(client: Socket, channel: CreateChannelDto) {
    console.log(`User creating channel ${JSON.stringify(channel, null, 4)}`);
    return this.chatService.createChannel(client, channel);
  }

  // @SubscribeMessage(Events.updateOneChannel)
  // updateOneChannel(client: Socket, channel: UpdateOneChannelDto) {}
}
