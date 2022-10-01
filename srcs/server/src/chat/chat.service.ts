import { Socket, Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import { MessageDto, CreateChannelDto, JoinChannelDto } from './dto';
import { v4 as uuidv4 } from 'uuid';
import * as Cookie from 'cookie';
import { Channel, ChannelUser, ChatUser, Message } from './entities';
import { eRedisDb, eChannelType, eChannelUserRole, eEvent } from './constants';
import { Inject, Logger } from '@nestjs/common';
import { Hashtable } from './interfaces/hashtable.interface';
import Redis from 'redis';
import { ChannelType } from '@prisma/client';
import { channel } from 'diagnostics_channel';

export class ChatService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis.RedisClientType,
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
    // client.emit(eEvent.UpdateOneMessage, msg);
  }

  async handleJoinChannel(client: Socket, joinChannelDto: JoinChannelDto) {
    const channel: Channel = await this.getObject(
      joinChannelDto.id.toString(),
      eRedisDb.Channels,
    );
    this.logger.debug(
      `This is the channel found by find ${JSON.stringify(channel, null, 4)}`,
    );

    if (
      joinChannelDto.type === eChannelType.Protected &&
      joinChannelDto.password !== channel.password
    ) {
      client.emit(eEvent.JoinChannelResponse, { msg: 'bad password' });
      return;
    }
    client.join(joinChannelDto.id.toString());
    if (
      //   !channel.users.find(
      //     (user: ChannelUser) => user.id === joinChannelDto.userId,
      //   )
      !channel.users[joinChannelDto.userId]
    ) {
      const joinedChannelAt = Date.now();
      const channelUser: ChannelUser = {
        id: joinChannelDto.userId,
        role: eChannelUserRole.User, //to be included in the joinChannelDto
        joinedChannelAt,
        isMuted: false,
        isBanned: false,
      };
      // channel.users.push(channelUser);
      channel.users[joinChannelDto.userId] = channelUser;

      this.setObject(channel.id.toString(), channel, eRedisDb.Channels);
    }
    client.emit(eEvent.JoinChannelResponse, {
      msg: 'changed channel',
      channel,
    });
    // manage bot sending message
    this._joinedChannelBot(
      joinChannelDto.userId,
      joinChannelDto.id,
      channel.name,
    );
  }

  updateOneChannel(client: Socket, channelId: number, type: ChannelType) {
    this.logger.log(channelId, type);
    if (type === ChannelType.PRIVATE || type === ChannelType.DIRECT) {
      return;
    }
    client.broadcast.emit(eEvent.UpdateOneChannel, channelId);
  }

  async initConnection(client: Socket, channelIds: string[]) {
    for (const channel of channelIds) {
      this.logger.debug(`Client join channel ${channel}`);
      client.join(channel);
    }
    const allMessages: Hashtable<Message[]> = await this._getAllMessages(
      channelIds,
    );
    if (!allMessages) return;
    client.emit(eEvent.UpdateMessages, allMessages);
  }

  private async _getAllMessages(channelIds: string[]) {
    if (!channelIds || channelIds.length === 0) return;
    let messages: Hashtable<Message[]> = {};
    for (const id of channelIds) {
      const msg = await this.redis.lRange(id, 0, -1);
      let parsedMessage = [];
      for (const message in msg) {
        parsedMessage.push(JSON.parse(msg[message]));
      }
      messages[id] = parsedMessage;
    }
    return messages;
  }

  async createChannel(client: Socket, channelId) {
    this.addToRoom(client, channelId);
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

  private async _joinedChannelBot(
    userId: number,
    channelId: number,
    channelName: string,
  ) {
    const user: ChatUser = await this.getObject(
      userId.toString(),
      eRedisDb.Users,
    );
    const date = Date.now();
    const message: Message = {
      content: `User ${user.name} has joined ${channelName}`,
      id:
        user.id.toString() + date.toString() + (Math.random() * 100).toString(),
      sentDate: date,
      toChannelOrUserId: channelId,
      fromUserId: this.messageBotId,
    };
    this.server.to(channelId.toString()).emit(eEvent.UpdateOneMessage, message);
    this.setObject(message.id.toString(), message, eRedisDb.Messages);
  }
}
