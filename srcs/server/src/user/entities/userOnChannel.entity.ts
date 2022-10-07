import { Channel } from './channel.entity'
import { User } from './user.entity'
import { UserRole } from '@prisma/client';

export class UserOnChannel {
  channelId: number;
  userId: number;
  role: UserRole;
  joinedAt: Date;
  isBanned: boolean = false;
  isMuted: boolean = false;
  hasLeftChannel: boolean = false;
  channel?: Channel;
  user?: User;
}
