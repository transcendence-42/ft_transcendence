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
import { MatchMakingDto } from './dto/matchMaking.dto';
import { Player } from './entities';

@UseFilters(new WsExceptionsFilter())
@WebSocketGateway()
export class GameGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  constructor(private readonly gameService: GameService) {}
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    //this.server.sockets.disconnectSockets(true);
    this.gameService.server = this.server;
    console.log(`Game WS server is up on port ${process.env.GAME_WS_PORT} ...`);
    console.log = function () {};
  }

  /** Handle new clients connection to the game */
  async handleConnection(@ConnectedSocket() client: Socket) {
    await this.gameService.clientConnection(client);
  }

  /** Handle client disconnection from the game */
  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.gameService.clientDisconnection(client);
  }

  /** Create a new game */
  @SubscribeMessage('createGame')
  create(@ConnectedSocket() client: Socket) {
    const players: Player[] = [];
    players.push(new Player(client, +client.handshake.query.userId));
    this.gameService.create(players);
  }

  /** Find all games */
  @SubscribeMessage('findAllGame')
  findAll(@ConnectedSocket() client: Socket) {
    this.gameService.findAll(client);
  }

  /** Update game grid by movement */
  @SubscribeMessage('updateGame')
  update(
    @ConnectedSocket() client: Socket,
    @MessageBody() updateGameDto: UpdateGameDto,
  ) {
    this.gameService.update(client, updateGameDto.id, updateGameDto.move);
  }

  /** Pause the game */
  @SubscribeMessage('pause')
  pause(
    @ConnectedSocket() client: Socket,
    @MessageBody() updateGameDto: UpdateGameDto,
  ) {
    this.gameService.pause(client, updateGameDto.id);
  }

  /** join game (new player) */
  @SubscribeMessage('joinGame')
  join(
    @ConnectedSocket() client: Socket,
    @MessageBody() updateGameDto: UpdateGameDto,
  ) {
    this.gameService.join(client, updateGameDto.id);
  }

  /** view game (new viewer) */
  @SubscribeMessage('viewGame')
  view(
    @ConnectedSocket() client: Socket,
    @MessageBody() updateGameDto: UpdateGameDto,
  ) {
    this.gameService.view(client, updateGameDto.id);
  }

  /** Reconnect game (existing player) */
  @SubscribeMessage('reconnectGame')
  reconnect(
    @ConnectedSocket() client: Socket,
    @MessageBody() updateGameDto: UpdateGameDto,
  ) {
    this.gameService.reconnect(client, updateGameDto.id);
  }

  /** Get the game grid */
  @SubscribeMessage('getGameGrid')
  getGameGrid(
    @ConnectedSocket() client: Socket,
    @MessageBody() updateGameDto: UpdateGameDto,
  ) {
    this.gameService.getGameGrid(client, updateGameDto.id);
  }

  /** One player abandons the game */
  @SubscribeMessage('playerAbandons')
  async abandonGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() updateGameDto: UpdateGameDto,
  ) {
    await this.gameService.abandonGame(client, updateGameDto.id);
  }

  /** One viewer leaves the game */
  @SubscribeMessage('viewerLeaves')
  viewerLeaves(
    @ConnectedSocket() client: Socket,
    @MessageBody() updateGameDto: UpdateGameDto,
  ) {
    this.gameService.viewerLeaves(client, updateGameDto.id);
  }

  /** Subscribe or unsubscribe to/from matchmaking */
  @SubscribeMessage('matchMaking')
  handleMatchMaking(
    @ConnectedSocket() client: Socket,
    @MessageBody() matchMakingDto: MatchMakingDto,
  ) {
    this.gameService.handleMatchMaking(client, matchMakingDto.value);
  }
}
