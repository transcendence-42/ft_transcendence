import { UserOnChannel } from './userOnChannel.entity';

export class Channel {
  id: number;
  name: string;
  channelMode: number;
  ownerId: number;
  password?: string;
  users?: UserOnChannel[];
}
