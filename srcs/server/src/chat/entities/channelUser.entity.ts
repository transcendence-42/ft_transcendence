import { eChannelUserRole } from '../constants';

export class ChannelUser {
  id: number;
  role: eChannelUserRole;
  joinedChannelAt: number;
  isMuted: boolean;
  isBanned: boolean;
}
