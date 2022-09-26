import { Credentials } from '../../generated/nestjs-dto/credentials.entity';
import { Stats } from '../../generated/nestjs-dto/stats.entity';
import { Rating } from '../../generated/nestjs-dto/rating.entity';
import { Channel } from '../../generated/nestjs-dto/channel.entity';
import { UserOnChannel } from '../../generated/nestjs-dto/userOnChannel.entity';
import { UserAchievement } from '../../generated/nestjs-dto/userAchievement.entity';
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
