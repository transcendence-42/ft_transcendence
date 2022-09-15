import { Socket, Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import { ChatUser } from './chatUser.entity';
import { Message, Channel } from './entities';
import { v4 as uuidv4 } from 'uuid';

// To do
// Add Dtos to payloads

export class ChatService {
  constructor() {
    this.allClients = [];
    this.allMessages = [];
  }
  @WebSocketServer()
  server: Server;

  allClients: ChatUser[];
  allMessages: Message[];

  handleMessage(client: Socket, message: Message) {
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
    this.server.emit('updateMessages', this.allMessages);
  }

  handleJoinChannel(client: Socket, channelName: string) {
    console.log(`Client ${client.id} has joined channelName ${channelName}`);
    const date = Date.now();
    const channel: Channel = {
      name: channelName,
      id: uuidv4(),
    };
    const message: Message = {
      content: `User ${client.id} has joined channelName`,
      id: String(date + Math.random() * 100),
      date,
      channel,
    };
    client.join(channelName);
    this.server.to(channelName).emit('userJoined', message);
  }

  handleSetId(client: Socket) {
    const userId = uuidv4();
    client.emit('setId', userId);
  }

  addUser(client: Socket, id: string) {
    const userExists = this.allClients.filter((user) => user.id === id);
    if (userExists.length === 0) {
      const chatUser: ChatUser = {
        socketId: client.id,
        id,
        role: 'user',
      };
      this.allClients.push(chatUser);
      this.server.emit('updateUsers', this.allClients);
    }
  }
}
