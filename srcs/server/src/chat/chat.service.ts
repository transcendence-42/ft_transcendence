import { Socket, Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import { MessageDto, CreateChannelDto, JoinChannelDto } from './dto';
import { v4 as uuidv4 } from 'uuid';
import { Events } from './entities/Events';
import * as Cookie from 'cookie';
import {
  Channel,
  ChannelTypes,
  ChannelUser,
  ChatUser,
  Message,
} from './entities';
import { Inject } from '@nestjs/common';
import {
  RedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from '@redis/client';

// To do
// Add Dtos to payloads
enum REDIS_DB {
  USERS_DB = 0,
  CHANNELS_DB,
  MSG_DB,
}

export class ChatService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: RedisClientType<
      RedisModules,
      RedisFunctions,
      RedisScripts
    >,
  ) {
    this.allMessages = [];
  }

  @WebSocketServer()
  server: Server;

  allMessages: MessageDto[];
  messageBotId: string;

  handleMessage(client: Socket, message: MessageDto) {
    console.log(
      `Recieved message ${JSON.stringify(message, null, 4)} from socket ${
        client.id
      }`,
    );
    const date = Date.now();
    const msg: Message = {
      id: String(date + Math.random() * 100),
      date,
      content: message.content,
      fromUserId: message.fromUserId,
      toChannelId: message.toChannelId,
    };
    this.allMessages.push(msg);
    console.log(`This is a list of all messages`);
    this.allMessages.map((msg) => console.log(msg));
    console.log(`End of all messags`);
    this.server.emit(Events.updateMessages, this.allMessages);
  }

  async handleJoinChannel(client: Socket, joinChannelDto: JoinChannelDto) {
    const channel = await this.getChannel(joinChannelDto.id);
    console.log(
      `This is the channel found by find ${JSON.stringify(channel, null, 4)}`,
    );

    if (
      joinChannelDto.type === ChannelTypes.protected &&
      joinChannelDto.password !== channel.password
    ) {
      client.emit(Events.joinChannelResponse, { msg: 'bad password' });
      return;
    }
    client.join(joinChannelDto.id);
    if (
      !channel.users.find(
        (user: ChannelUser) => user.id === joinChannelDto.userId,
      )
    ) {
      const joinedChannelAt = Date.now();
      const channelUser: ChannelUser = {
        id: joinChannelDto.userId,
        role: 'user', //to be included in the joinChannelDto
        joinedChannelAt,
      };
      channel.users.push(channelUser);
      this.setChannel(channel);
    }
    client.emit(Events.joinChannelResponse, {
      msg: 'changed channel',
      channel,
    });
    // manage bot sending message
    // const userId = this.allClients.find((cli) => cli.socketId === client.id).id;
    // this._joinedChannelBot(userId, joinChannelDto.id);
  }

  handleSetId(client: Socket, hasUserId: string) {
    if (hasUserId) return;
    console.log(`Setting id for user ${client.id}`);
    const userId = uuidv4();
    client.emit(Events.setIdResponse, userId);
  }

  async addUser(client: Socket, id: string) {
    const names = [
      'George',
      'Toto',
      'Judu',
      'Masto',
      'Flo monBg',
      'Nouf',
      'Karpathy',
      'Lex',
    ];
    const allUsers = await this.getAllUsers();
    const userExists = allUsers.filter((userDb) => userDb.id === id);
    if (userExists.length === 0) {
      const chatUser: ChatUser = {
        socketId: client.id,
        id,
        name: names[Math.floor(Math.random() * 10) % names.length],
      };
      console.log(`Adding user name: ${chatUser.name}, id: ${id}`);
      this.redis.select(REDIS_DB.USERS_DB);
      this.redis.set(chatUser.id, JSON.stringify(chatUser));
      allUsers.push(chatUser);
      client.emit(Events.addUserResponse, chatUser);
      this.server.emit(Events.updateUsers, allUsers);
    }
  }

  async createChannel(client: Socket, channelDto: CreateChannelDto) {
    // if channel name taken but channel is private it's okay
    let allChannels = await this.getAllChannels();
    console.log(`all channels = ${allChannels}`);
    for (const channel of allChannels) {
      console.log(`Channel ${JSON.stringify(channel, null, 4)}`);
      if (channel.name === channelDto.name) {
        console.log('Found a channel with the same name');
        client.emit(Events.createChannelResponse, {
          msg: 'channel name already taken',
        });
        return;
      }
    }
    const createdAt = Date.now();
    let channel: Channel = {
      id: uuidv4(),
      name: channelDto.name,
      type: channelDto.type,
      createdAt,
      users: [],
      password: channelDto.password,
    };
    channel.users = channelDto.users.map((user) => {
      const channelUser: ChannelUser = {
        id: user.id,
        role: user.role,
        joinedChannelAt: createdAt,
      };
      return channelUser;
    });

    this.setChannel(channel);
    client.join(channel.id);
    channel.users.forEach(async (user) => {
      if (user.role !== 'owner') {
        const userDbJson = this.getUser(user.id).then((userDb) =>
          this.server.to(userDb.socketId).emit(Events.addedToRoom),
        );
        // const userDbObj: ChatUser = JSON.parse(userDbJson);
        // this.server.to(userDbObj.socketId).emit(Events.addedToRoom);
      }
    });
    // channel.users.forEach((user) => user.role !== 'owner' ? this.server.to(user.))
    // emit to all user ids in users a addedToChannel event with channel.id
    // as data.
    // On reception they will emit a addedToChannel with data channel.id event
    // which will make them join the specified channel id
    client.emit(Events.createChannelResponse, {
      msg: 'channel created successfuly',
      channel,
    });

    allChannels.push(channel);
    this.server.emit(Events.updateChannels, allChannels);
  }

  async handleAddedToRoom(client: Socket, channelId: string) {
    const allChannels = await this.getAllChannels();
    const allUsers = await this.getAllUsers();
    const userId = this.parseIdCookie(client.handshake.headers.cookie);
    const user = allUsers.find((user) => user.id === userId);
    const chan = allChannels.find((channel) => channel.id === channelId);
    console.log(`User ${user.name} is joinined room ${chan.name}`);
    client.join(channelId);
  }

  async getAllUsers() {
    this.redis.select(REDIS_DB.USERS_DB);
    const all = await this.redis.keys('*');
    let allUsers: ChatUser[] = [];
    await Promise.all(
      all.map(async (key: string) => {
        if (key === 'PING' || key === 'ping') return;
        const userJson = await this.redis.get(key);
        const userObj: ChatUser = JSON.parse(userJson);
        allUsers.push(userObj);
        return;
      }),
    );
    return allUsers;
  }

  setChannel(channel: Channel) {
    this.redis.select(REDIS_DB.CHANNELS_DB);
    this.redis.set(channel.id, JSON.stringify(channel));
  }

  setUser(user: ChatUser) {
    this.redis.select(REDIS_DB.USERS_DB);
    this.redis.set(user.id, JSON.stringify(user));
  }

  async getUser(userId: string): Promise<ChatUser> {
    this.redis.select(REDIS_DB.USERS_DB);
    const user = await this.redis.get(userId);
    const parsedUser: ChatUser = JSON.parse(user);
    return parsedUser;
  }

  async getChannel(channelId: string): Promise<Channel> {
    this.redis.select(REDIS_DB.CHANNELS_DB);
    const channelJson = await this.redis.get(channelId);
    const channelObj = JSON.parse(channelJson);
    return channelObj;
  }

  async getAllChannels() {
    this.redis.select(REDIS_DB.CHANNELS_DB);
    const all = await this.redis.keys('*');
    let allChannels: Channel[] = [];
    await Promise.all(
      all.map(async (key: string) => {
        if (key === 'PING' || key === 'ping') return;
        const channelJson = await this.redis.get(key);
        const channelObj: Channel = JSON.parse(channelJson);
        allChannels.push(channelObj);
        return;
      }),
    );
    return allChannels;
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

  private _joinedChannelBot(userId: string, channelId: string) {
    const date = Date.now();
    const message: Message = {
      content: `User ${userId} has joined channelName`,
      id: String(date + Math.random() * 100),
      date,
      toChannelId: channelId,
      fromUserId: '0000000000',
    };
    this.server.to(channelId).emit(Events.userJoined, message);
  }
}
