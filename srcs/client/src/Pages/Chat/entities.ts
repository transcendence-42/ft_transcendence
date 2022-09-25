import { eChannelType, eChannelUserRole } from './constants';

export interface MessageDto {
  content: string;
  fromUserId: string;
  toChannelOrUserId: string;
}

export interface Hashtable<T> {
  [key: string]: T;
}

export interface Message extends MessageDto {
  id: string;
  sentDate: number;
}

export interface Channel {
  id: string;
  name: string;
  type: eChannelType;
  users: Hashtable<ChannelUser>;
  createdAt: number;
  messages?: Message[];
  password?: string;
}

export interface JoinChannelDto {
  id: string;
  name: string; //debugging purposes
  type: eChannelType;
  userId: string;
  password?: string;
}

export interface ChatUser {
  socketId: string;
  id: string;
  name: string;
  profilePicture: string;
  channelsId?: string[];
  directMessges?: Message[];
}

export interface ChannelUser {
  id: string;
  role: eChannelUserRole;
  joinedChannelAt: number;
  isMuted: boolean;
  isBanned: boolean;
}

export interface CreateChannelDto {
  name: string;
  type: eChannelType;
  ownerId: string;
  password?: string;
}
