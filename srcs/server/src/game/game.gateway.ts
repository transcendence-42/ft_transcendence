import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { UpdateGameDto } from './dto/update-game.dto';
import { Socket, Server } from 'socket.io';
import { OnModuleInit, UseFilters } from '@nestjs/common';
import { WsExceptionsFilter } from './exceptions/game.exception.filter';

@UseFilters(new WsExceptionsFilter())
@WebSocketGateway(4343, { cors: true })
export class GameGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  constructor(private readonly gameService: GameService) {}

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.sockets.disconnectSockets(true);
    console.log('Websocket server is up...');
  }

  /** Handle new clients connection to the game */
  handleConnection(@ConnectedSocket() client: Socket) {
    this.gameService.clientConnection(
      client,
      this.server,
      this.gameService.games,
    );
  }

  /** Handle client disconnection from the game */
  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.gameService.clientDisconnection(
      client,
      this.server,
      this.gameService.games,
    );
  }

  /** Create a new game */
  @SubscribeMessage('createGame')
  create(@ConnectedSocket() client: Socket) {
    // add the client socket to a socket array
    const players: Socket[] = [client];
    this.gameService.create(players, this.server, this.gameService.games);
  }

  /** Find all games */
  @SubscribeMessage('findAllGame')
  findAll(@ConnectedSocket() client: Socket) {
    this.gameService.findAll(client, this.gameService.games);
  }

  /** Update game grid by movement */
  @SubscribeMessage('updateGame')
  update(
    @ConnectedSocket() client: Socket,
    @MessageBody() updateGameDto: UpdateGameDto,
  ) {
    this.gameService.update(
      client,
      this.server,
      updateGameDto.id,
      updateGameDto,
      this.gameService.games,
    );
  }

  /** join game (new player) */
  @SubscribeMessage('joinGame')
  join(
    @ConnectedSocket() client: Socket,
    @MessageBody() updateGameDto: UpdateGameDto,
  ) {
    this.gameService.join(
      client,
      this.server,
      updateGameDto.id,
      this.gameService.games,
    );
  }

  /** view game (new viewer) */
  @SubscribeMessage('viewGame')
  view(
    @ConnectedSocket() client: Socket,
    @MessageBody() updateGameDto: UpdateGameDto,
  ) {
    this.gameService.view(client, updateGameDto.id, this.gameService.games);
  }

  /** Reconnect game (existing player) */
  @SubscribeMessage('reconnectGame')
  reconnect(
    @ConnectedSocket() client: Socket,
    @MessageBody() updateGameDto: UpdateGameDto,
  ) {
    this.gameService.reconnect(
      client,
      updateGameDto.id,
      this.gameService.games,
    );
  }

  /** Get the game grid */
  @SubscribeMessage('getGameGrid')
  getGameGrid(
    @ConnectedSocket() client: Socket,
    @MessageBody() updateGameDto: UpdateGameDto,
  ) {
    this.gameService.getGameGrid(
      client,
      updateGameDto.id,
      this.gameService.games,
    );
  }

  /** Get the game scores */
  @SubscribeMessage('getGameScores')
  getGameScores(
    @ConnectedSocket() client: Socket,
    @MessageBody() updateGameDto: UpdateGameDto,
  ) {
    this.gameService.getGameScores(
      client,
      updateGameDto.id,
      this.gameService.games,
    );
  }

  /** One player is leaving the game */
  @SubscribeMessage('playerLeave')
  leaveGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() updateGameDto: UpdateGameDto,
  ) {
    this.gameService.leaveGame(
      client,
      this.server,
      updateGameDto.id,
      this.gameService.games,
    );
  }
}
