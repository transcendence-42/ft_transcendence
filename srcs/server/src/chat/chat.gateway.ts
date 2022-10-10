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
import { eRedisDb, eEvent } from './constants';
import { RequestUser } from 'src/common/entities';

@WebSocketGateway(4444, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'https://localhost:3000',
      'https://127.0.0.1:3000',
    ],
    credentials: true,
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
    this.chatService.initBot();
    this.chatService.server = server;
    this.chatService.initRedis();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handleConnection(client: Socket, ...args: any[]) {
    const user = client.handshake.auth.id;
    client.join(user.id);
    this.logger.debug(
      `User id:${user} with socket id:${client.id} is trying to connect`,
    );
  }

  async handleDisconnect(client: Socket) {
    const sessionCookie = this.chatService.parseIdCookie(
      client.handshake.headers.cookie,
    );
    this.logger.debug(`User is disconnecting`)
  }

  @SubscribeMessage(eEvent.InitConnection)
  initConnection(client: Socket, channelIds: string[]) {
    this.logger.debug(
      `Initing connection for user ${client.handshake.auth.id} and socket.id ${client.id}`,
    );
    this.chatService.initConnection(client, channelIds);
  }

  @SubscribeMessage(eEvent.SendMessage)
  handleMessage(client: Socket, message: MessageDto) {
    this.logger.log(
      `Recieved message ${JSON.stringify(message, null, 4)} from socket ${
        client.id
      }`,
    );
    console.log('messages recieved');
    return this.chatService.handleMessage(client, message);
  }

  @SubscribeMessage(eEvent.JoinChannel)
  handleJoinChannel(client: Socket, channelId: number) {
    this.logger.debug(`This is channel joining ${channelId}`);
    return this.chatService.joinChannel(client, channelId);
  }

  @SubscribeMessage(eEvent.AddedToChannel)
  addedToChannel(client: Socket, channelId: number) {
    this.chatService.addedToChannel(client, channelId);
  }

  @SubscribeMessage(eEvent.AddUser)
  addUser(client: Socket, payload: { channelId; userId }) {
    this.logger.debug(
      `Recieved AddedUser with data ${JSON.stringify(payload)}`,
    );
    return this.chatService.addUser(client, payload.channelId, payload.userId);
  }

  @SubscribeMessage(eEvent.UpdateOneChannel)
  updateOneChannel(client: Socket, id: number) {
    this.logger.debug(`gateway ${id} `);
    return this.chatService.updateOneChannel(client, id);
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
    return this.chatService.updateChannels(client);
  }

  @SubscribeMessage(eEvent.CreateChannel)
  handleCreateChannel(client: Socket, channelId: number) {
    this.logger.debug(
      `Recieved event createChannel for channel Id ${channelId}`,
    );
    return this.chatService.createChannel(client, channelId);
  }

  @SubscribeMessage(eEvent.MuteUser)
  muteUser(client: Socket, { userId, channelId }) {
    return this.chatService.muteUser(client, userId, channelId);
  }

  @SubscribeMessage(eEvent.BanUser)
  banUser(client: Socket, { userId, channelId }) {
    return this.chatService.banUser(client, userId, channelId);
  }
  //on login: create room with (user_userId) if doesnt exist
  // json.set(rooms, '.rooms[roomId', )
  //on create channel: create room with (room_channelId)

  // on connect the user sends their channel information (all Ids)
  // the server then adds the socket to the rooms.
  // (for const channelId in channelIds)
  // socket.join(channelId)
}
