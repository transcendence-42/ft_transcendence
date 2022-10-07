import { ChannelType } from '@prisma/client';
import { User } from 'src/user/entities/user.entity';
import { UserOnChannel } from 'src/user/entities/userOnChannel.entity';

export class Channel {
  id: number;
  name: string;
  type: ChannelType;
  password: string | null;
  owner?: User;
  ownerId: number;
  users?: UserOnChannel[];
}
