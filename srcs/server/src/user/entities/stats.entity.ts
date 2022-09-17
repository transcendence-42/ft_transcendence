import { User } from './user.entity'

export class Stats {
  id: number;
  wins: number;
  losses: number;
  user?: User ;
  userId: number;
}
