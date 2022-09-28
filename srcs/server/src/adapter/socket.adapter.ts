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
    port = this.configService.get<number>(this.servers[this.nbOfConnections]);
    console.log('Adapter logged', this.servers[this.nbOfConnections]);
    this.nbOfConnections++;
    const server = super.createIOServer(port, {
      cors: {
        origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
        credentials: true,
      },
    });
    return server;
  }
}
