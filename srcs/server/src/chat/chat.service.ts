import { Inject, Logger } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChannelType, UserRole } from '@prisma/client';
import Redis from 'redis';
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
    private readonly redis: Redis.RedisClientType,
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
    await this.redis.lPush(channelId, JSON.stringify(msg));
    this.server.to(channelId).emit(eEvent.UpdateOneMessage, msg);
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
    this.server
      .to(this._makeId(userId, eIdType.User))
      .emit(
        eEvent.MuteUser,
        `You have been muted from channel ${channel.name}`,
      );
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

  leaveChannel(client: Socket, userId: number, channelId: number) {
    this.server
      .to(this._makeId(userId, eIdType.User))
      .emit(eEvent.LeaveChannel, channelId);
  }

  leavingChannel(client: Socket, channelId: number) {
    client.leave(this._makeId(channelId, eIdType.Channel));
  }

  async banUser(client: Socket, userId: number, channelId: number) {
    const channel = await this.channelService.findOne(channelId);
    this.server
      .to(this._makeId(userId, eIdType.User))
      .emit(eEvent.BanUser, channel.name);
    this.server
      .to(this._makeId(channelId, eIdType.Channel))
      .emit(eEvent.UpdateOneChannel, channelId);
    this.server
      .to(this._makeId(userId, eIdType.User))
      .emit(eEvent.LeaveChannel, channelId);
    this.logger.debug(`Banning user ${userId} on channel ${channel.name}`);
    setTimeout(async () => {
      // delete user because they are no longer banned and thus can join the channel again
      // need to emit an event to the user to update all channels and its own channels
      // in the two setTimeout I need to check for the existance of the channel.
      // if they don't exist I don't need to send an event
      // I can do that by checking delete user. Try {delete| update} user
      // catch e === channel doesnt existe
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
    this.server
      .to(this._makeId(channelId, eIdType.Channel))
      .emit(eEvent.UpdateUserOnChannel, channelId);
  }

  async joinChannel(client: Socket, channelId: number) {
    client.join(this._makeId(channelId, eIdType.Channel));
    const messages = await this._getMessage(channelId.toString());
    client.emit(eEvent.GetMessages, { channelId, messages });
    client.broadcast.emit(eEvent.UpdateOneChannel, channelId);
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
    if (!allMessages) return;
    client.emit(eEvent.UpdateMessages, allMessages);
  }

  private async _getMessage(id: string) {
    const msg = await this.redis.lRange(id, 0, -1);
    let parsedMessage = [];
    for (const message in msg) {
      parsedMessage.push(JSON.parse(msg[message]));
    }
    return parsedMessage;
  }

  private async _getAllMessages(channelIds: string[]) {
    if (!channelIds || channelIds.length === 0) return;
    let messages: Hashtable<Message[]> = {};
    for (const id of channelIds) {
      messages[id] = await this._getMessage(id);
    }
    return messages;
  }

  async createChannel(client: Socket, channelId) {
    client.join(this._makeId(channelId, eIdType.Channel));
    client.broadcast.emit(eEvent.UpdateOneChannel, channelId);
  }

  async addToRoom(client: Socket, channelId: number) {
    console.log('adding client to room', channelId);
    client.join(channelId.toString());
  }

  async getAllAsHashtable<T>(dataBase: eRedisDb): Promise<Hashtable<T>> {
    await this.redis.select(dataBase);
    const allKeys = await this.redis.keys('*');
    const allKeyValues: Hashtable<T> = {};
    await Promise.all(
      allKeys.map(async (key: string) => {
        const value: T = await this.getObject(key, dataBase);
        allKeyValues[key] = value;
        return;
      }),
    );
    return allKeyValues;
  }

  async handleGetAllMessages(client: Socket, channelIds: string[]) {
    let allMessages: Hashtable<Message[]>;
    for (const id in channelIds) {
      const message = await this.getMessage(id);
      allMessages.id = message;
    }
    client.emit(eEvent.UpdateMessages, allMessages);
  }

  // async getAllMessagesWithUserId(userId: number) {
  // const allMessages = await this.redis.json.get('messages', {path: '.messages[?@.]'})
  // }

  async getAllAsArray<T>(dataBase: eRedisDb): Promise<T[]> {
    await this.redis.select(dataBase);
    const allKeys = await this.redis.keys('*');
    const allValues: T[] = [];
    await Promise.all(
      allKeys.map(async (key: string) => {
        const value: T = await this.getObject(key, dataBase);
        allValues.push(value);
        return;
      }),
    );
    return allValues;
  }

  async setObject<T>(key: string, value: T, dataBase: number) {
    // await this.redis.json.set(key, '.', JSON.parse(JSON.stringify(value)));
    this.logger.debug(`This is key to set object in redis ${key}`);
    await this.redis.json.arrAppend(
      key,
      '.',
      JSON.parse(JSON.stringify(value)),
    );
  }

  async getMessage(key: string) {
    const message = (await this.redis.json.get(key, {
      path: '.',
    })) as any;
    return message;
  }

  async getObject<T>(key: string, dataBase: eRedisDb): Promise<T> {
    const stringObj = await this.redis.get(key);
    const obj = JSON.parse(stringObj);
    return obj;
  }

  // trying to emit private channels only to the people who are inside it
  // and protected to everyone
  initBot() {
    this.messageBotId = 4824892084908;
  }

  parseIdCookie(cookies) {
    if (cookies) {
      const cookiesObj = Cookie.parse(cookies);
      if (cookiesObj['auth_session']) return cookiesObj['auth_session'];
    }
    return null;
  }

  async getJson() {
    await this.redis.select(2);
    const res = await this.redis.json.get(
      '$.users[?(@.id==="4c28308d-37c8-4c7e-ba38-169ca7d43cd9")]',
    );
    const res2 = await this.redis.json.get(
      '5d7dc013-a32e-45ea-8767-d65954214f9b',
      { path: '.users[?(@.id=="4c28308d-37c8-4c7e-ba38-169ca7d43cd9")]' },
    );
  }

  private _makeId(id: number | string, idType: eIdType): string {
    let strId;
    if (typeof id === 'string') strId = id;
    else strId = id.toString();
    return (
      (idType === eIdType.User
        ? 'user'
        : idType === eIdType.Channel
        ? 'channel'
        : idType === eIdType.Message
        ? 'channel'
        : 'unkown') + strId
    );
  }

  private async _joinedChannelBot(
    userId: number,
    // username: string,
    channelId: number,
    channelName: string,
  ) {
    const date = Date.now();
    const message: Message = {
      content: `User has joined ${channelName}`,
      id:
        userId.toString() + date.toString() + (Math.random() * 100).toString(),
      sentDate: date,
      toChannelOrUserId: channelId,
      fromUserId: this.messageBotId,
    };
    this.server.to(channelId.toString()).emit(eEvent.UpdateOneMessage, message);
    this.setObject(message.id.toString(), message, eRedisDb.Messages);
  }
}
