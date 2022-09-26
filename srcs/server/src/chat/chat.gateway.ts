import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Socket } from 'socket.io';
import { OnModuleInit, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(ChatGateway.name);

  onModuleInit() {
    this.logger.log(`Module chat is up`);
  }

  afterInit(server: any) {
    this.chatService.initBot();
    this.chatService.server = server;
  }

  async handleConnection(client: Socket, ...args: any[]) {
    const userId: string = this.chatService.parseIdCookie(
      client.handshake.headers.cookie,
    );
    this.logger.debug(
      `User with id ${userId} and socket id ${client.id} is trying to reconnect`,
    );
    if (userId) {
      // Updating socket id to match the new socket id of the user on refresh
      const user: ChatUser = await this.chatService.getObject(
        userId,
        REDIS_DB.USERS_DB,
      );
      this.logger.debug(`User ${JSON.stringify(user, null, 4)} reconnected`);
      try {
        const allUsers: Hashtable<ChatUser> =
          await this.chatService.getAllAsHashtable(REDIS_DB.USERS_DB);
        client.emit(eEvent.UpdateUsers, allUsers);
        Object.values(allUsers).map((user) =>
          this.logger.debug(`${JSON.stringify(user, null, 4)}`),
        );
      } catch (err) {
        this.logger.debug('Currently there are no users');
      }

      try {
        const allChannels: Hashtable<Channel> =
          await this.chatService.getAllAsHashtable(REDIS_DB.CHANNELS_DB);
        client.emit(eEvent.UpdateChannels, allChannels);
      } catch (err) {
        this.logger.debug('Currenlty there are no channels');
      }
      const allMessages = await this.chatService.getAllAsArray(REDIS_DB.MSG_DB);
      client.emit(eEvent.UpdateMessages, allMessages);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`client ${client.id} disconnected`);
  }

  @SubscribeMessage(eEvent.SendMessage)
  handleMessage(client: Socket, message: MessageDto) {
    this.logger.debug(
      `Recieved message ${JSON.stringify(message, null, 4)} from socket ${
        client.id
      }`,
    );
    return this.chatService.handleMessage(client, message);
  }

  @SubscribeMessage(eEvent.JoinChannel)
  handleJoinChannel(client: Socket, channel: JoinChannelDto) {
    this.logger.debug(
      `This is channel joining ${JSON.stringify(channel, null, 4)}`,
    );
    return this.chatService.handleJoinChannel(client, channel);
  }

  // @SubscribeMessage(Events.updateOneChannel)
  // updateOneChannel(client: Socket, channel: UpdateOneChannelDto) {}
}
