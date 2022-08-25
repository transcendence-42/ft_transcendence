import { Credentials } from '../../generated/nestjs-dto/credentials.entity';
import { Stats } from '../../generated/nestjs-dto/stats.entity';
import { Ladder } from '../../generated/nestjs-dto/ladder.entity';
import { Channel } from '../../generated/nestjs-dto/channel.entity';
import { UserOnChannel } from '../../generated/nestjs-dto/userOnChannel.entity';
import { PlayerOnMatch } from '../../generated/nestjs-dto/playerOnMatch.entity';
import { UserFriendship } from '../../generated/nestjs-dto/userFriendship.entity';

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
  ladderHistory?: Ladder[];
  ownedChannels?: Channel[];
  channels?: UserOnChannel[];
  friendshipRequested?: UserFriendship[];
  friendshipAccepted?: UserFriendship[];
  matches?: PlayerOnMatch[];
}
