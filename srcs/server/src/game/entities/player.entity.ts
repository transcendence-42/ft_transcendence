import { Client } from './client.entity';

export class Player extends Client {
  score?: number;
  winProbability?: number;
}
