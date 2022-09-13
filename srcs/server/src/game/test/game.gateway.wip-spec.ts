import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';
import { io } from 'socket.io-client';
import { GameModule } from '../game.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { mockUserDto } from 'src/user/test/stubs/mock.user.dto';
import { User } from '@prisma/client';
import { GameService } from '../game.service';

describe('Game WebSocketGateway e2e tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userService: UserService;
  let gameService: GameService;
  const user: User[] = [];
  const ws: any[] = [];

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [GameModule],
    }).compile();

    // init app with services
    app = moduleRef.createNestApplication();
    prisma = moduleRef.get<PrismaService>(PrismaService);
    userService = moduleRef.get<UserService>(UserService);
    gameService = moduleRef.get<GameService>(GameService);
    app.useWebSocketAdapter(new WsAdapter(app) as any);
    await app.init();

    // prepare data
    prisma.cleanDatabase();
    for (let i = 0; i < 4; ++i) {
      user.push(await userService.create(mockUserDto[i]));
      ws.push(
        io(`http://localhost:${process.env.GAME_WS_PORT}`, {
          query: { userId: user[i].id },
        }),
      );
    }
  });

  afterAll(async () => {
    for (let i = 0; i < 4; ++i) {
      await ws[i].close();
    }
    await app.close();
  });

  describe(`On event 'findAllGame'`, () => {
    it(`should return a list of all games`, async () => {
      // create 2 games
      ws[0].emit('createGame');
      await new Promise<void>((resolve) =>
        ws[0].on('gameId', (data: any) => {
          expect(data.id).toBeInstanceOf(String);
          resolve();
        }),
      );
      //await ws[1].emit('joinGame', { id: gameId });
    });
  });
});
