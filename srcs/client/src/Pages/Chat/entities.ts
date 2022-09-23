import { eChannelType, eChannelUserRole } from "./constants";

export interface MessageDto {
  content: string;
  fromUserId: string;
  toChannelOrUserId: Channel;
}

export interface Message extends MessageDto {
  id: string;
  sentDate: number;
}

export interface Channel {
  id: string;
  name: string;
  type: eChannelType;
  users: ChannelUser[];
  createdAt: number;
  messages?: Message[];
  password?: string;
}

export interface JoinChannelDto {
  id: string;
  name: string; //debugging purposes
  userId: string;
  password?: string;
}

export interface ChatUser {
  socketId: string;
  id: string;
  name: string;
  channels?: Channel[];
  directMessges?: Message[];
}

export interface ChannelUser {
  id: string;
  role: eChannelUserRole;
  joinedChannelAt: number;
  isMuted: boolean;
}

export interface CreateChannelDto {
  name: string;
  type: eChannelType;
  users: ChannelUser[];
  password?: string;
}
