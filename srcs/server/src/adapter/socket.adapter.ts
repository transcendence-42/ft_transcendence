import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ConfigService } from '@nestjs/config';

export class SocketIoAdapter extends IoAdapter {
  nbOfConnections: number;
  servers: string[];
  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService,
  ) {
    super(app);
    this.nbOfConnections = 0;
    this.servers = ['CHAT_WS_PORT', 'GAME_WS_PORT'];
  }

  createIOServer(port: number) {
    port = this.configService.get<number>('GAME_WS_PORT');
    const server = super.createIOServer(port, {
      cors: true,
      namespace: '/api/gamews',
      path: '/api/gamews/socket.io',
    });
    return server;
  }
}
