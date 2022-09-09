import { Client } from './client.entity';

export class Player extends Client {
  constructor() {
    super();
    this.score = 0;
    this.updating = false;
  }
  score?: number;
  side?: number;
  updating?: boolean;
}
