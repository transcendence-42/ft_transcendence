import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { UpdateGameDto } from './dto/update-game.dto';
import { Socket, Server } from 'socket.io';
import { Catch, OnModuleInit, UseFilters, Logger } from '@nestjs/common';
import { WsExceptionsFilter } from './exceptions/game.exception.filter';
import { MatchMakingDto } from './dto/matchMaking.dto';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { UpdateOptionsDto } from './dto/update-options.dto';

@UseFilters(new WsExceptionsFilter())
@Catch(WsException)
@WebSocketGateway(4343, {
  cors: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  },
  path: '/api/gamews/socket.io',
})
export class GameGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  constructor(private readonly gameService: GameService) {}
  private readonly logger = new Logger(GameGateway.name);

  @WebSocketServer()
  server: Server;

  async onModuleInit() {
    //this.server.sockets.disconnectSockets(true);
    this.gameService.server = this.server;
    await this.gameService.disconnectOldSockets();
    this.server.disconnectSockets();
    this.logger.log(`Module game is up`);
  }

  /** Handle new clients connection to the game */
  async handleConnection(@ConnectedSocket() client: Socket) {
    await this.gameService.clientConnection(client);
  }

  /** Handle client disconnection from the game */
  async handleDisconnect(@ConnectedSocket() client: Socket) {
    await this.gameService.clientDisconnection(client);
  }

  /** Create a new game */
  @SubscribeMessage('createGame')
  async createWithOne(@ConnectedSocket() client: Socket) {
    await this.gameService.createWithOne(client);
  }

  /** Find all games */
  @SubscribeMessage('findAllGame')
  async findAll(@ConnectedSocket() client: Socket) {
    await this.gameService.findAll(client);
  }

  /** Update game grid by movement */
  @SubscribeMessage('updateGame')
  async update(
    @ConnectedSocket() client: Socket,
    @MessageBody() updateGameDto: UpdateGameDto,
  ) {
    await this.gameService.update(client, updateGameDto.id, updateGameDto.move);
  }

  /** Pause the game */
  @SubscribeMessage('pause')
  async pause(
    @ConnectedSocket() client: Socket,
    @MessageBody() updateGameDto: UpdateGameDto,
  ) {
    await this.gameService.pause(client, updateGameDto.id);
  }

  /** Continue the game */
  @SubscribeMessage('continue')
  async handleContinue(
    @ConnectedSocket() client: Socket,
    @MessageBody() updateGameDto: UpdateGameDto,
  ) {
    await this.gameService.continue(client, updateGameDto.id);
  }

  /** join game (new player) */
  @SubscribeMessage('joinGame')
  async join(
    @ConnectedSocket() client: Socket,
    @MessageBody() updateGameDto: UpdateGameDto,
  ) {
    await this.gameService.join(client, updateGameDto.id);
  }

  /** view game (new viewer) */
  @SubscribeMessage('viewGame')
  async view(
    @ConnectedSocket() client: Socket,
    @MessageBody() updateGameDto: UpdateGameDto,
  ) {
    await this.gameService.view(client, updateGameDto.id);
  }

  /** Get the game grid */
  @SubscribeMessage('getGameGrid')
  async getGameGrid(
    @ConnectedSocket() client: Socket,
    @MessageBody() updateGameDto: UpdateGameDto,
  ) {
    await this.gameService.getGameGrid(client, updateGameDto.id);
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
  async viewerLeaves(
    @ConnectedSocket() client: Socket,
    @MessageBody() updateGameDto: UpdateGameDto,
  ) {
    await this.gameService.viewerLeaves(client, updateGameDto.id);
  }

  /** Subscribe or unsubscribe to/from matchmaking */
  @SubscribeMessage('matchMaking')
  async handleMatchMaking(
    @ConnectedSocket() client: Socket,
    @MessageBody() matchMakingDto: MatchMakingDto,
  ) {
    await this.gameService.handleMatchMaking(client, matchMakingDto.value);
  }

  /** Get player info */
  @SubscribeMessage('getPlayersInfos')
  async handlePlayersInfos(@ConnectedSocket() client: Socket) {
    await this.gameService.handlePlayersInfos(client);
  }

  /** Create new challenge */
  @SubscribeMessage('challengePlayer')
  async handleCreateChallenge(
    @ConnectedSocket() client: Socket,
    @MessageBody() createChallengeDto: CreateChallengeDto,
  ) {
    await this.gameService.createChallenge(client, createChallengeDto.id);
  }

  /** Update challenge */
  @SubscribeMessage('updateChallenge')
  async handleUpdateChallenge(
    @ConnectedSocket() client: Socket,
    @MessageBody() updateChallengeDto: UpdateChallengeDto,
  ) {
    await this.gameService.handleUpdateChallenge(
      client,
      updateChallengeDto.id,
      updateChallengeDto.status,
    );
  }

  /** Switch a user to offline until the next action */
  @SubscribeMessage('switchStatus')
  async handleSwitchStatus(@ConnectedSocket() client: Socket) {
    await this.gameService.switchStatus(client);
  }

  /** Update username and pic associated with a player on redis */
  @SubscribeMessage('updatePlayer')
  async handleUpdatePlayer(
    @ConnectedSocket() client: Socket,
    @MessageBody() updatePlayerDto: UpdatePlayerDto,
  ) {
    await this.gameService.updatePlayer(client, updatePlayerDto);
  }

  /** Update options on the game */
  @SubscribeMessage('updateOptions')
  async handleUpdateOptions(
    @ConnectedSocket() client: Socket,
    @MessageBody() updateOptionsDto: UpdateOptionsDto,
  ) {
    await this.gameService.updateOptions(updateOptionsDto.id, updateOptionsDto);
  }
}
