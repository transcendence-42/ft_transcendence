import { eChannelType, eUserRole } from "./constants";

export interface Hashtable<T> {
  [key: string]: T;
}

export interface MessageDto {
  content: string;
  fromUserId: number;
  toChannelOrUserId: number;
}

export interface Message extends MessageDto {
  id: string;
  sentDate: number;
}

export interface JoinChannelDto {
  id: number;
  name: string; //debugging purposes
  type: eChannelType;
  userId: number;
  password?: string;
}

export interface ChatUser {
  socketId: string;
  id: number;
  username: string;
  profilePicture: string;
  channels?: UserOnChannel[];
  directMessges?: Message[];
}
export interface Friendship {
  requesterId: number;
  addresseeId: number;
  date: Date;
  status: number;
}

export interface UserOnChannel {
  channelId: number;
  userId: number;
  role: eUserRole;
  joinedAt: Date;
  mutedTill: Date;
  bannedTill: Date;
  channel: Channel;
}

export interface UpdateUserOnChannelDto {
  role?: eUserRole;
  mutedTill?: Date;
  bannedTill?: Date;
}

export interface CreateUserOnChannelDto {}

export interface Channel {
  id: number;
  name: string;
  type: eChannelType;
  users?: UserOnChannel[];
  messages?: Message[];
  password?: string;
}

export interface UpdateChannelDto {
  name?: string;
  type?: eChannelType;
  password?: string;
  ownerId?: number;
}

export interface CreateChannelDto {
  name: string;
  type: eChannelType;
  ownerId: number;
  password?: string;
}

export interface User {
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
export interface PlayerOnMatch {
  match?: Match;
  matchId: number;
  player?: User;
  playerId: number;
  side: number;
  score: number;
  status?: number;
}

export interface Match {
  id: number;
  date: Date;
  players?: PlayerOnMatch[];
}

export interface UserAchievement {
  achievement?: Achievement;
  achievementId: number;
  user?: User;
  userId: number;
  date: Date;
}
export interface Achievement {
  id: number;
  name: Date;
  usersStats?: UserAchievement[];
}
export interface Rating {
  id: number;
  date: Date;
  rating: number;
  user?: User;
  userId: number;
}

export interface Credentials {
  id: number;
  email: string;
  username: string;
  password: string | null;
  user?: User;
  userId: number;
  twoFactorActivated: boolean;
  twoFactorSecret: string | null;
}

export interface Stats {
  id: number;
  wins: number;
  losses: number;
  user?: User;
  userId: number;
}
