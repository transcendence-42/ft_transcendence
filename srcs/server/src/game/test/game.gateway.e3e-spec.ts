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

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get<PrismaService>(PrismaService);
    userService = moduleRef.get<UserService>(UserService);
    gameService = moduleRef.get<GameService>(GameService);
    app.useWebSocketAdapter(new WsAdapter(app) as any);
    await app.init();
  });

  beforeEach(async () => {
    await prisma.cleanDatabase();
    // create fresh users and ws for match
    for (let i = 0; i < 4; ++i) {
      user.push(await userService.create(mockUserDto[i]));
      ws.push(io('http://localhost:4848'));
    }
  });

  afterEach(async () => {
    for (let i = 0; i < 4; ++i) {
      ws[i].close();
    }
  });

  describe(`On event 'findAllGame'`, () => {
    it(`should return a list of all games`, async () => {
      // create 2 games
      for (let i = 0; i < 4; i += 2) {
        gameService.create([
          { userId: user[i].id, socket: ws[i] },
          { userId: user[i + 1].id, socket: ws[i + 1] },
        ]);
      }
      // fire event to server
      ws[0].emit('findAllGame', (response) => {
        expect(response.length).toBe(2);
      });
    });
  });

  afterEach(async function () {
    await app.close();
  });
});
