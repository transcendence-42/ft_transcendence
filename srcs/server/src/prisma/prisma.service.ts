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
    // await this.user.deleteMany({});
    // await this.credentials.deleteMany({});
    // const models = Reflect.ownKeys(this).filter((key) => key[0] !== '_');
    // return Promise.all(models.map((modelKey) => this[modelKey].deleteMany()));
    const propertyNames = Object.getOwnPropertyNames(this);
    const modelNames = propertyNames.filter(
      (propertyName) => !propertyName.startsWith('_')
    );
  
    return Promise.all(modelNames.map((model) => this[model].deleteMany()));
  };
}
