import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV == 'production') return;
    const propertyNames = Object.getOwnPropertyNames(this);
    const modelNames = propertyNames.filter(
      (propertyName) => !propertyName.startsWith('_'),
    );

    return Promise.all(modelNames.map((model) => this[model].deleteMany()));
  }
}
