import { eChannelUserRole } from '../constants';

export class ChannelUser {
  id: string;
  role: eChannelUserRole;
  joinedChannelAt: number;
  isMuted: boolean;
  isBanned: boolean;
}
