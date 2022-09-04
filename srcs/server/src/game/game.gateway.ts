import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { UpdateGameDto } from './dto/update-game.dto';
import { Socket } from 'socket.io';
import { Server } from 'http';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway()
export class GameGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  constructor(private readonly gameService: GameService) {}

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    console.log('Websocket server is up...');
  }

  /** Handle new clients connection to the game */
  handleConnection(client: Socket) {
    // join default lobby socket
    client.join('lobby');
    // get query information
    const userId = client.handshake.query.userId;
    console.log(`user number : ${userId} (${client.id}) connected !`);
    // add the client to a global list
    this.gameService.clientList.push({ socketId: client.id, userId: +userId });
  }

  /** Handle client disconnection from the game */
  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId;
    console.log(`user : ${userId} (${client.id}) disconnected`);
    // Remove the viewer from the list
    this.gameService.clientList = this.gameService.clientList.filter(
      (client) => client.userId !== +userId,
    );
    // Broadcast that user left
    this.server.emit('broadcast', {
      message: `user : ${userId} left the server`,
    });
  }

  /** Create a new game */
  @SubscribeMessage('createGame')
  create(client: Socket) {
    this.gameService.create(client, this.gameService.serverData);
  }

  /** Find all games */
  @SubscribeMessage('findAllGame')
  findAll(client: Socket) {
    this.gameService.findAll(client, this.gameService.serverData);
  }

  /** Update game (players, viewers, params, canvas) */
  @SubscribeMessage('updateGame')
  update(@MessageBody() updateGameDto: UpdateGameDto) {
    this.gameService.update(
      updateGameDto.id,
      updateGameDto,
      this.gameService.serverData,
    );
  }

  /** End a game */
  @SubscribeMessage('removeGame')
  remove(@MessageBody() id: string) {
    return this.gameService.remove(id, this.gameService.serverData);
  }
}
