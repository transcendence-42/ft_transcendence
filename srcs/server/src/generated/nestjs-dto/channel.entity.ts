import { ChannelType } from '@prisma/client';
import { UserOnChannel } from './userOnChannel.entity';

export class Channel {
  id: number;
  name: string;
  type: ChannelType;
  password: string | null;
  ownerId: number;
  users?: UserOnChannel[];
}
