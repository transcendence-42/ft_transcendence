import { Socket, Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import { ChatUser } from './chatUser.entity';
import { Message } from './message.entity';
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
    client.emit('updateMessages', this.allMessages);
  }
}
