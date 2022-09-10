import { Match } from './match.entity';
import { User } from 'src/user/entities/user.entity';

export class PlayerOnMatch {
  match?: Match;
  matchId: number;
  player?: User;
  playerId: number;
  side: number;
  score: number;
  status?: number;
}
