import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';
import * as WebSocket from 'ws';
import { GameModule } from '../game.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

describe('Game WebSocketGateway e2e tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userService: UserService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [GameModule],
    }).compile();

    app = moduleRef.createNestApplication();
    userService = moduleRef.get<UserService>(UserService);
    prisma = moduleRef.get<PrismaService>(PrismaService);
    app.useWebSocketAdapter(new WsAdapter(app) as any);
    await app.init();
  });

  describe(`EVENT: findAllGame`, () => {
    // Add before each with fake clients and fake games
    // Add returns to service functions
    it(`should return a list of all games`, async () => {
      const ws = new WebSocket('ws://localhost:4343');
      await new Promise((resolve) => ws.on('open', resolve));

      ws.send(
        JSON.stringify({
          event: 'push',
          data: {
            test: 'test',
          },
        }),
      );
      await new Promise<void>((resolve) =>
        ws.on('message', (data) => {
          expect(JSON.parse(data).data.test).toBe('test');
          ws.close();
          resolve();
        }),
      );
    });
  });

  afterEach(async function () {
    await app.close();
  });
});
