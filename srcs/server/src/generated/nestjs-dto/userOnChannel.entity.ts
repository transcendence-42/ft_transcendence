import { UserRole } from '@prisma/client';
import { Channel } from './channel.entity';
import { User } from '../../user/entities/user.entity';

export class UserOnChannel {
  channelId: number;
  userId: number;
  role: UserRole;
  joinedAt: Date;
  mutedTill: Date;
  bannedTill: Date;
  channel?: Channel;
  user?: User;
}
