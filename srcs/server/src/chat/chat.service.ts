import { Socket, Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import { MessageDto, CreateChannelDto, JoinChannelDto } from './dto';
import { v4 as uuidv4 } from 'uuid';
import * as Cookie from 'cookie';
import { Channel, ChannelUser, ChatUser, Message } from './entities';
import { eChannelType, eChannelUserRole, eEvent } from './constants';
import { Inject, Logger } from '@nestjs/common';
import { Hashtable } from './interfaces/hashtable.interface';
import Redis from 'redis';

enum REDIS_DB {
  USERS_DB = 1,
  CHANNELS_DB,
  MSG_DB,
}

export class ChatService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis.RedisClientType,
  ) {}

  private readonly logger = new Logger(ChatService.name);
  @WebSocketServer()
  server: Server;

  messageBotId: string;

  async handleMessage(client: Socket, message: MessageDto) {
    const date = Date.now();
    const msg: Message = {
      id: message.fromUserId + String(date + Math.random() * 100),
      sentDate: date,
      content: message.content,
      fromUserId: message.fromUserId,
      toChannelOrUserId: message.toChannelOrUserId,
    };
    await this.setObject<Message>(msg.id, msg, REDIS_DB.MSG_DB);
    const allMessages = await this.getAllAsArray(REDIS_DB.MSG_DB);
    this.server.emit(eEvent.UpdateMessages, allMessages);
  }

  async handleJoinChannel(client: Socket, joinChannelDto: JoinChannelDto) {
    const channel: Channel = await this.getObject(
      joinChannelDto.id,
      REDIS_DB.CHANNELS_DB,
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
    client.join(joinChannelDto.id);
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

      this.setObject(channel.id, channel, REDIS_DB.CHANNELS_DB);
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

  getAllMessages(client: Socket, userId) {}

  async getAllAsHashtable<T>(dataBase: REDIS_DB): Promise<Hashtable<T>> {
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

  async getAllAsArray<T>(dataBase: REDIS_DB): Promise<T[]> {
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
    await this.redis.select(dataBase);
    await this.redis.json.set(key, '.', JSON.parse(JSON.stringify(value)));
  }

  async getObject<T>(key: string, dataBase: REDIS_DB): Promise<T> {
    await this.redis.select(dataBase);
    const type = await this.redis.type(key);
    const jsonObj: T = (await this.redis.json.get(key, { path: '.' })) as any;
    return jsonObj;
  }

  // trying to emit private channels only to the people who are inside it
  // and protected to everyone
  initBot() {
    this.messageBotId = uuidv4();
  }

  parseIdCookie(cookies) {
    if (cookies) {
      const cookiesObj = Cookie.parse(cookies);
      if (cookiesObj['id']) return cookiesObj['id'];
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
    userId: string,
    channelId: string,
    channelName: string,
  ) {
    const user: ChatUser = await this.getObject(userId, REDIS_DB.USERS_DB);
    const date = Date.now();
    const message: Message = {
      content: `User ${user.name} has joined ${channelName}`,
      id: String(date + Math.random() * 100),
      sentDate: date,
      toChannelOrUserId: channelId,
      fromUserId: this.messageBotId,
    };
    this.server.to(channelId).emit(eEvent.UpdateOneMessage, message);
    this.setObject(message.id, message, REDIS_DB.MSG_DB);
  }
}
