import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ConfigService } from '@nestjs/config';

export class SocketIoAdapter extends IoAdapter {
  nbOfServers: number;
  serverPorts = ['GAME_WS_PORT', 'CHAT_WS_PORT'];
  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService,
  ) {
    super(app);
    this.nbOfServers = 0;
  }

  createIOServer(port: number) {
    port = this.configService.get<number>(this.serverPorts[this.nbOfServers]);
    this.nbOfServers += 1;
    const server = super.createIOServer(port, { cors: true });
    return server;
  }
}
