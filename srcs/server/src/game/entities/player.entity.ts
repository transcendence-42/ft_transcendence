import { Client } from './client.entity';

export class Player extends Client {
  constructor() {
    super();
    this.score = 0;
  }
  score?: number;
  side?: number;
}
