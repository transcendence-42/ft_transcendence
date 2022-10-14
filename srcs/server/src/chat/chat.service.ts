import { Inject, Logger } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
// import Redis from 'redis';
import Redis from 'ioredis';
import * as Cookie from 'cookie';
import { Message } from './entities';
import { eRedisDb, eEvent, eIdType } from './constants';
import { Hashtable } from './interfaces/hashtable.interface';
import { MessageDto } from './dto';
import { ChannelService } from 'src/channels/channel.service';
import { UpdateUserOnChannelDto } from 'src/channels/dto';

export class ChatService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
    private readonly channelService: ChannelService,
  ) {}

  private readonly logger = new Logger(ChatService.name);
  @WebSocketServer()
  server: Server;

  messageBotId: number;

  async initRedis() {
    await this.redis.select(eRedisDb.Messages);
  }

  async handleMessage(client: Socket, message: MessageDto) {
    const date = Date.now();
    const msg: Message = {
      id:
        message.fromUserId.toString() +
        date.toString() +
        (Math.random() * 100).toString(),
      sentDate: date,
      content: message.content,
      fromUserId: message.fromUserId,
      toChannelOrUserId: message.toChannelOrUserId,
    };
    const channelId = msg.toChannelOrUserId.toString();
    console.log('emiting message to channel id', channelId);
    await this.redis
      .multi()
      .select(eRedisDb.Messages)
      .lpush(channelId, JSON.stringify(msg))
      .exec();
    this.server
      .to(this._makeId(channelId, eIdType.Channel))
      .emit(eEvent.UpdateOneMessage, msg);
  }

  async muteUser(client: Socket, userId: number, channelId: number) {
    const channel = await this.channelService.findOne(channelId);
    if (!channel) {
      this.logger.debug(
        `The channel which recieved a mute user event has been deleted`,
      );
      return;
    }
    this.server
      .to(this._makeId(channelId, eIdType.Channel))
      .emit(eEvent.UpdateOneChannel, channelId);
    this.server.to(this._makeId(userId, eIdType.User)).emit(eEvent.MuteUser, {
      message: `You have been muted from channel ${channel.name}`,
      channelId,
    });
    this.logger.debug(`Muting user ${userId} on channel ${channel.name}`);
    setTimeout(async () => {
      await this.channelService.updateUserOnChannel(channelId, userId, {
        isMuted: false,
      } as UpdateUserOnChannelDto);
      this.server
        .to(this._makeId(userId, eIdType.User))
        .emit(
          eEvent.MuteUser,
          `You are now unmuted from channel ${channel.name}`,
        );
      this.server
        .to(this._makeId(channelId, eIdType.Channel))
        .emit(eEvent.UpdateOneChannel, channelId);
    }, 1000 * 60);
    // inside the setTimeout include an emit event to display you are now unmuted ?
    // so that the user can refresh its own user if they are still in the channel.
  }

  async banUser(client: Socket, userId: number, channelId: number) {
    const channel = await this.channelService.findOne(channelId);
    this.server
      .to(this._makeId(userId, eIdType.User))
      .emit(eEvent.BanUser, channel.name);
    this.server
      .to(this._makeId(channelId, eIdType.Channel))
      .emit(eEvent.UpdateOneChannel, channelId);
    this.logger.debug(`Banning user ${userId} on channel ${channel.name}`);
    setTimeout(async () => {
      try {
        const deleteUser = await this.channelService.deleteUserOnChannel(
          channelId,
          userId,
        );
        this.server
          .to(this._makeId(channelId, eIdType.Channel))
          .emit(eEvent.UpdateOneChannel, channelId);
      } catch (e) {
        this.logger.error(`tried to delete a user on an empty channel`);
      }
    }, 1000 * 60);
  }

  async addedToChannel(client: Socket, channelId: number) {
    await this.joinChannel(client, channelId);
    client.emit(eEvent.UpdateOneChannel, channelId);
    client.emit(eEvent.UpdateChannels);
    this.server
      .to(this._makeId(channelId, eIdType.Channel))
      .emit(eEvent.UpdateUserOnChannel, channelId);
  }

  async joinChannel(client: Socket, channelId: number) {
    client.join(this._makeId(channelId, eIdType.Channel));
    const messages = await this._getMessage(channelId.toString());
    this.logger.debug(
      `These are the messages for channel ${channelId}, ${JSON.stringify(
        messages,
      )}`,
    );
    client.emit(eEvent.GetMessages, { channelId, messages });
    client.broadcast.emit(eEvent.UpdateOneChannel, channelId);
  }

  updateChannels(client: Socket) {
    this.server.emit(eEvent.UpdateChannels);
  }

  leavingChannel(client: Socket, channeldId: number) {
    client.leave(this._makeId(channeldId, eIdType.Channel));
  }

  leaveChannel(client: Socket, userId: number, channelId: number) {
    client.leave(this._makeId(channelId, eIdType.Channel));
    this.server
      .to(this._makeId(userId, eIdType.User))
      .emit(eEvent.LeaveChannel, channelId);
  }

  updateOneChannel(client: Socket, channelId: number) {
    client.broadcast.emit(eEvent.UpdateOneChannel, channelId);
    client
      .to(this._makeId(channelId, eIdType.Channel))
      .emit(eEvent.UpdateUserOnChannel, channelId);
  }

  async initConnection(client: Socket, channelIds: string[]) {
    const id = client.handshake.auth.id;
    client.join(this._makeId(id, eIdType.User));
    for (const channel of channelIds) {
      this.logger.debug(`Client join channel ${channel}`);
      client.join(this._makeId(channel, eIdType.Channel));
    }
    const allMessages: Hashtable<Message[]> = await this._getAllMessages(
      channelIds,
    );
    this.logger.debug(
      `these are all messages in init connection ${JSON.stringify(
        allMessages,
      )}`,
    );
    client.emit(eEvent.UpdateMessages, allMessages);
  }

  private async _getMessage(id: string) {
    // const msg = await this.redis.multi().select(eRedisDb.Messages).lrange(id, 0, -1).exec()[1];
    const msg: any = (
      await this.redis
        .multi()
        .select(eRedisDb.Messages)
        .lrange(id, 0, -1)
        .exec()
    )[1][1];

    this.logger.debug(
      `These are the messages inside getMessage with id ${id} ${JSON.stringify(
        msg,
      )}`,
    );
    const parsedMessage = [];
    for (const message in msg) {
      parsedMessage.push(JSON.parse(msg[message]));
    }
    return parsedMessage;
  }

  private async _getAllMessages(channelIds: string[]) {
    if (!channelIds || channelIds.length === 0) return;
    const messages: Hashtable<Message[]> = {};
    for (const id of channelIds) {
      messages[id] = await this._getMessage(id);
    }
    return messages;
  }

  async createChannel(client: Socket, channelId) {
    client.join(this._makeId(channelId, eIdType.Channel));
    client.broadcast.emit(eEvent.UpdateOneChannel, channelId);
  }

  async addUser(client: Socket, channelId, userId) {
    client.join(this._makeId(channelId, eIdType.Channel));
    client
      .to(this._makeId(userId, eIdType.User))
      .emit(eEvent.AddUser, channelId);
  }

  async handleGetAllMessages(client: Socket, channelIds: string[]) {
    let allMessages: Hashtable<Message[]>;
    for (const id in channelIds) {
      const message = await this._getMessage(id);
      allMessages.id = message;
    }
    client.emit(eEvent.UpdateMessages, allMessages);
  }

  parseIdCookie(cookies) {
    if (cookies) {
      const cookiesObj = Cookie.parse(cookies);
      if (cookiesObj['auth_session']) return cookiesObj['auth_session'];
    }
    return null;
  }

  private _makeId(id: number | string, idType: eIdType): string {
    let strId: any;
    if (typeof id === 'string') strId = id;
    else strId = id.toString();
    const createdId =
      (idType === eIdType.User
        ? 'user'
        : idType === eIdType.Channel
        ? 'channel'
        : idType === eIdType.Message
        ? 'message'
        : 'unkown') + strId;
    this.logger.debug(
      `this is the string fabricated form make id ${createdId}`,
    );
    return createdId;
  }
}
