import { Socket, Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import { ChatUser } from './chatUser.entity';
import { Message, Channel, Payload } from './entities';
import { v4 as uuidv4 } from 'uuid';

export class ChatService {
  constructor() {
    this.allClients = [];
    this.allMessages = [];
  }
  @WebSocketServer()
  server: Server;

  allClients: ChatUser[];
  allMessages: Message[];

  handleMessage(client: Socket, payload: Payload) {
    console.log(
      `Recieved message ${JSON.stringify(
        payload.channel,
        null,
        4,
      )} from socket ${client.id}`,
    );
    payload.message.id = String(payload.message.date + Math.random() * 100);
    this.allMessages.push(payload.message);
    console.log(`This is a list of all messages`);
    this.allMessages.map((msg) => console.log(msg));
    console.log(`End of all messags`);
    client.emit('updateMessages', this.allMessages);
  }

  handleJoinChannel(client: Socket, channelName: string) {
    console.log(`Client ${client.id} has joined channelName ${channelName}`);
    const date = Date.now();
    const channel: Channel = {
      name: channelName,
      id: uuidv4(),
    };
    const message: Message = {
      message: `User ${client.id} has joined channelName`,
      id: String(date + Math.random() * 100),
      date,
    };
    client.join(channelName);
    this.server.to(channelName).emit('userJoined', { message, channel });
  }
}
