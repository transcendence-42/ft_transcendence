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
import { ChannelType } from '@prisma/client';
import { channel } from 'diagnostics_channel';

enum REDIS_DB {
  USERS_DB = 1,
  CHANNELS_DB,
  MSG_DB,
}

@WebSocketGateway({
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
    const allMessages = await this.chatService.getAllAsArray(REDIS_DB.MSG_DB);
    client.emit(eEvent.UpdateMessages, allMessages);
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

  @SubscribeMessage(eEvent.UpdateOneChannel)
  updateOneChannel(client: Socket, channel: { id: number; type: ChannelType }) {
    this.logger.debug(`gateway ${channel.id} and type ${channel.type}`);
    return this.chatService.updateOneChannel(client, channel.id, channel.type);
  }
}
