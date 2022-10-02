import { eUserRole, eChannelType } from "../constants";
import { Message } from "./message.entity";

export class User {
  id: number;
  username: string;
  email: string;
  createdAt: Date;
  profilePicture: string | null;
  currentStatus: number;
  eloRating: number;
  credentials?: Credentials | null;
  stats?: Stats | null;
  ratingHistory?: Rating[];
  channels?: UserOnChannel[];
  friendshipRequested?: Friendship[];
  friendshipAddressed?: Friendship[];
  matches?: PlayerOnMatch[];
  achievements?: UserAchievement[];
}

export class PlayerOnMatch {
  match?: Match;
  matchId: number;
  player?: User;
  playerId: number;
  side: number;
  score: number;
  status?: number;
}

export class Match {
  id: number;
  date: Date;
  players?: PlayerOnMatch[];
}

export class UserAchievement {
  achievement?: Achievement;
  achievementId: number;
  user?: User;
  userId: number;
  date: Date;
}
export class Achievement {
  id: number;
  name: Date;
  usersStats?: UserAchievement[];
}
export class Rating {
  id: number;
  date: Date;
  rating: number;
  user?: User;
  userId: number;
}

export class Credentials {
  id: number;
  email: string;
  username: string;
  password: string | null;
  user?: User;
  userId: number;
  twoFactorActivated: boolean;
  twoFactorSecret: string | null;
}

export class Stats {
  id: number;
  wins: number;
  losses: number;
  user?: User;
  userId: number;
}
export interface Friendship {
  requesterId: number;
  addresseeId: number;
  date: Date;
  status: number;
}

export class UserOnChannel {
  channelId: number;
  userId: number;
  role: eUserRole;
  joinedAt: Date;
  isMuted: boolean = false;
  isBanned: boolean = false;
  channel: Channel;
  hasLeftChannel: boolean;
}

export class Channel {
  id: number;
  name: string;
  type: eChannelType;
  users?: UserOnChannel[];
  messages?: Message[];
  password?: string;
}
