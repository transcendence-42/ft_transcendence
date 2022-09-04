import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { UpdateGameDto } from './dto/update-game.dto';
import { Client } from './entities/client.entity';

@Injectable()
export class GameService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  clientList: Client[];

  /** Create a new game in dedicated room with 2 players */
  create(client: Socket) {
    // get user from client
    const userId = client.handshake.query.id;
    // create a new room for this client
    client.join()
  }

  /** Find all created games */
  findAll() {
    return `This action returns all game`;
  }

  /** Find a game by its game id */
  findOne(id: number) {
    return `This action returns a #${id} game`;
  }

  /** update a game (infos, status, players, viewers, ...) */
  update(id: string, updateGameDto: UpdateGameDto) {
    return `This action updates a #${id} game`;
  }

  /** remove a game */
  remove(id: string) {
    return `This action removes a #${id} game`;
  }
}
