import { User } from './user.entity';
import { UserOnChannel } from './userOnChannel.entity';

export class Channel {
  id: number;
  name: string;
  type: string;
  password: string | null;
  owner?: User;
  ownerId: number;
  users?: UserOnChannel[];
}
