import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(4343, { cors: true })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private numClient = 0;
  private clients = [];

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket, payload: any) {
    console.log(`client connected`);
    console.log(`client number : ` + (+this.clients.length + 1));
    // add client to the client array
    this.clients.push({ id: this.clients.length + 1, socketId: client.id });
    this.server.emit('broadcast', {
      message: `${client.id} joined the server`,
      clients: this.clients,
    });
  }

  handleDisconnect(client: any) {
    console.log(`client disconnected`);
    this.clients = this.clients.filter((cli) => cli.socketId !== client.id);
    this.server.emit('broadcast', {
      message: `${client.id} leaved the server`,
      clients: this.clients,
    });
  }
}
