import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ConfigService } from '@nestjs/config';

export class SocketIoAdapter extends IoAdapter {
  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService,
  ) {
    super(app);
  }

  createIOServer(port: number) {
    port = this.configService.get<number>('GAME_WS_PORT');
    const server = super.createIOServer(port, { cors: true, namespace: '/api/gamews', path: '/api/gamews/socket.io' } );
    return server;
  }
}
