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
import { Socket, Server } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { JoinGameDto } from './dto/join-game.dto';
import { ViewGameDto } from './dto/view-game.dto';

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
    this.gameService.clientConnection(
      client,
      this.server,
      this.gameService.serverData,
    );
  }

  /** Handle client disconnection from the game */
  handleDisconnect(client: Socket) {
    this.gameService.clientDisconnection(
      client,
      this.server,
      this.gameService.serverData,
    );
  }

  /** Create a new game */
  @SubscribeMessage('createGame')
  create(client: Socket) {
    // add the client socket to a socket array
    const players: Socket[] = [client];
    this.gameService.create(players, this.server, this.gameService.serverData);
  }

  /** Find all games */
  @SubscribeMessage('findAllGame')
  findAll(client: Socket) {
    this.gameService.findAll(client, this.gameService.serverData);
  }

  /** Update game grid by movement */
  @SubscribeMessage('updateGame')
  update(client: Socket, @MessageBody() updateGameDto: UpdateGameDto) {
    this.gameService.update(
      client,
      updateGameDto.id,
      updateGameDto,
      this.gameService.serverData,
    );
  }

  /** join game (new player) */
  @SubscribeMessage('joinGame')
  join(client: Socket, @MessageBody() joinGameDto: JoinGameDto) {
    this.gameService.join(
      client,
      this.server,
      joinGameDto.id,
      this.gameService.serverData,
    );
  }

  /** view game (new viewer) */
  @SubscribeMessage('viewGame')
  view(client: Socket, @MessageBody() viewGameDto: ViewGameDto) {
    this.gameService.view(client, viewGameDto.id, this.gameService.serverData);
  }
}
