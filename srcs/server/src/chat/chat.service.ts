import { Socket, Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import { MessageDto, CreateChannelDto } from './dto';
import { v4 as uuidv4 } from 'uuid';
import { Events } from './entities/Events';
import { Channel, ChannelTypes, ChatUser } from './entities';

// To do
// Add Dtos to payloads

export class ChatService {
  constructor() {
    this.allClients = [];
    this.allMessages = [];
    this.allChannels = [
      {
        name: '42Ai',
        id: '09423423423',
        usersIdList: ['243242'],
        type: 'public',
      },
      {
        name: 'electronics',
        id: '0923423',
        usersIdList: ['2242'],
        type: 'public',
      },
    ];
  }
  @WebSocketServer()
  server: Server;

  allClients: ChatUser[];
  allMessages: MessageDto[];
  allChannels: Channel[];

  handleMessage(client: Socket, message: MessageDto) {
    console.log(
      `Recieved message ${JSON.stringify(message, null, 4)} from socket ${
        client.id
      }`,
    );
    message.id = String(message.date + Math.random() * 100);
    this.allMessages.push(message);
    console.log(`This is a list of all messages`);
    this.allMessages.map((msg) => console.log(msg));
    console.log(`End of all messags`);
    this.server.emit(Events.updateMessages, this.allMessages);
  }

  handleJoinChannel(client: Socket, channelName: string) {
    console.log(`Client ${client.id} has joined channelName ${channelName}`);
    const date = Date.now();
    const channel: Channel = this.allChannels.find(
      (channel) => channelName === channel.name,
    );
    console.log(
      `This is the channel found by find ${JSON.stringify(channel, null, 4)}`,
    );
    const message: MessageDto = {
      content: `User ${client.id} has joined channelName`,
      id: String(date + Math.random() * 100),
      date,
      channel,
    };
    client.join(channelName);
    client.emit(Events.joinChannelAnwser, { msg: 'changed', channel });
    this.server.to(channelName).emit(Events.userJoined, message);
  }

  handleSetId(client: Socket) {
    const userId = uuidv4();
    client.emit(Events.setId, userId);
  }

  addUser(client: Socket, id: string) {
    const userExists = this.allClients.filter((user) => user.id === id);
    if (userExists.length === 0) {
      const chatUser: ChatUser = {
        socketId: client.id,
        id,
        role: 'user',
      };
      console.log(`Adding user ${id}`);
      this.allClients.push(chatUser);
      this.server.emit(Events.updateUsers, this.allClients);
    }
  }

  createChannel(client: Socket, channelDto: CreateChannelDto) {
    const isChannelNameTaken = this.allChannels.filter(
      (channel) => channelDto.name === channel.name,
    )[0];
    if (isChannelNameTaken) {
      client.emit(Events.createChannel, {});
    } else {
      const newChannel: Channel = {
        id: uuidv4(),
        name: channelDto.name,
        usersIdList: [client.handshake.headers.cookie],
        type: channelDto.type,
        password: channelDto.password,
      };
      this.allChannels.push(newChannel);
      this._sendChannels(client, newChannel);
    }
  }

  // trying to emit private channels only to the people who are inside it
  // and protected to everyone

  private _sendChannels(client: Socket, channel: Channel) {
    if (channel.type === ChannelTypes.private) {
      this.server
        .to(channel.name)
        .emit(Events.updateChannels, this.allChannels);
    } else {
      this.server.emit(Events.updateChannels, this.allChannels);
    }
  }
}
