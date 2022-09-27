import { Credentials } from './credentials.entity';
import { Stats } from './stats.entity';
import { Rating } from 'src/rating/entities/rating.entity';
import { Channel } from './channel.entity';
import { UserOnChannel } from './userOnChannel.entity';
import { UserAchievement } from './userAchievement.entity';
import { PlayerOnMatch } from 'src/match/entities/playerOnMatch.entity';
import { Friendship } from 'src/friendship/entities/friendship.entity';

export class User {
  id: number;
  username: string;
  email: string;
  createdAt: Date;
  profilePicture: string | null;
  currentStatus: number;
  eloRating: number;
  credentials?: Credentials | null;
  stats?: Stats | null;
  ratingHistory?: Rating[];
  channels?: Channel[];
  friendshipRequested?: Friendship[];
  friendshipAddressed?: Friendship[];
  matches?: PlayerOnMatch[];
  achievements?: UserAchievement[];
}
