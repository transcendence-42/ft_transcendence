import { OnModuleInit, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { MessageDto } from './dto';
import { eRedisDb, eEvent, eIdType } from './constants';
import { RequestUser } from 'src/common/entities';

@WebSocketGateway(4444, {
  cors: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    // credentials: true,
  },
  path: '/api/chatws/socket.io',
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

  async afterInit(server: any) {
    this.chatService.server = server;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handleConnection(client: Socket, ...args: any[]) {
    const user = client.handshake.auth.id;
    // client.join(user.id);
    client.join(this.chatService._makeId(user, eIdType.User));
    this.logger.debug(
      `User id:${user} with socket id:${client.id} is trying to connect`,
    );
  }

  async handleDisconnect(client: Socket) {
    const id = this.chatService.parseIdCookie(
      client.handshake.auth?.id.toString(),
    );
    this.logger.debug(`User is disconnecting and userId ${id} ${client.id}`);
  }

  @SubscribeMessage(eEvent.AddedToRoom)
  handleAddedToRoom(client: Socket, id: string) {
    client.join(this.chatService._makeId(id, eIdType.User));
  }

  @SubscribeMessage(eEvent.GetMessages)
  async handleGetAllMessages(client: Socket) {
    const allMessages = await this.chatService.getFullMessages();
    client.emit(eEvent.UpdateMessages, allMessages);
  }

  @SubscribeMessage(eEvent.InitConnection)
  async initConnection(client: Socket, channelIds: string[]) {
    this.logger.debug(
      `Initing connection for user ${client.handshake.auth.id} and socket.id ${client.id}`,
    );
    await this.chatService.initConnection(client, channelIds);
  }

  @SubscribeMessage(eEvent.SendMessage)
  async handleMessage(client: Socket, message: MessageDto) {
    this.logger.log(
      `Recieved message ${JSON.stringify(message, null, 4)} from socket ${
        client.id
      }`,
    );
    console.log('messages recieved');
    await this.chatService.handleMessage(client, message);
  }

  @SubscribeMessage(eEvent.JoinChannel)
  async handleJoinChannel(client: Socket, channelId: number) {
    this.logger.debug(`This is channel joining ${channelId}`);
    await this.chatService.joinChannel(client, channelId);
  }

  @SubscribeMessage(eEvent.AddedToChannel)
  async addedToChannel(client: Socket, channelId: number) {
    await this.chatService.addedToChannel(client, channelId);
  }

  @SubscribeMessage(eEvent.AddUser)
  async addUser(client: Socket, payload: { channelId; userId }) {
    this.logger.debug(
      `Recieved AddedUser with data ${JSON.stringify(payload)}`,
    );
    await this.chatService.addUser(client, payload.channelId, payload.userId);
  }

  @SubscribeMessage(eEvent.UpdateOneChannel)
  updateOneChannel(client: Socket, id: number) {
    this.logger.debug(`gateway ${id} `);
    this.chatService.updateOneChannel(client, id);
  }

  @SubscribeMessage(eEvent.LeaveChannel)
  leaveChannel(client: Socket, { userId, channelId }) {
    this.chatService.leaveChannel(client, userId, channelId);
  }

  @SubscribeMessage(eEvent.LeavingChannel)
  leavingChannel(client: Socket, channelId) {
    this.chatService.leavingChannel(client, channelId);
  }

  @SubscribeMessage(eEvent.UpdateChannels)
  updateChannels(client: Socket) {
    this.chatService.updateChannels(client);
  }

  @SubscribeMessage(eEvent.CreateChannel)
  async handleCreateChannel(client: Socket, channelId: number) {
    this.logger.debug(
      `Recieved event createChannel for channel Id ${channelId}`,
    );
    await this.chatService.createChannel(client, channelId);
  }

  @SubscribeMessage(eEvent.MuteUser)
  async muteUser(client: Socket, { userId, channelId }) {
    await this.chatService.muteUser(client, userId, channelId);
  }

  @SubscribeMessage(eEvent.BanUser)
  async banUser(client: Socket, { userId, channelId }) {
    await this.chatService.banUser(client, userId, channelId);
  }
}
