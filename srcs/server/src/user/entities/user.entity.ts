import { Credentials } from '../../generated/nestjs-dto/credentials.entity';
import { Stats } from '../../generated/nestjs-dto/stats.entity';
import { Rank } from '../../generated/nestjs-dto/rank.entity';
import { Channel } from '../../generated/nestjs-dto/channel.entity';
import { UserOnChannel } from '../../generated/nestjs-dto/userOnChannel.entity';
import { PlayerOnMatch } from '../../generated/nestjs-dto/playerOnMatch.entity';
import { Friendship } from '../../generated/nestjs-dto/friendship.entity';
import { UserAchievement } from '../../generated/nestjs-dto/userAchievement.entity';

export class User {
  id: number;
  username: string;
  email: string;
  createdAt: Date;
  profilePicture: string | null;
  currentStatus: number;
  currentLadder: number;
  credentials?: Credentials | null;
  stats?: Stats | null;
  rankingHistory?: Rank[];
  ownedChannels?: Channel[];
  channels?: UserOnChannel[];
  friendshipRequested?: Friendship[];
  friendshipAddressed?: Friendship[];
  matches?: PlayerOnMatch[];
  achievements?: UserAchievement[];
}
