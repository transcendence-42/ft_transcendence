import { eChannelType, eUserRole } from "../constants";
import { Message } from "./message.entity";

export interface Hashtable<T> {
  [key: string]: T;
}

export interface JoinChannelDto {
  id: number;
  name: string; //debugging purposes
  type: eChannelType;
  userId: number;
  password?: string;
}

export interface UpdateUserOnChannelDto {
  role?: eUserRole;
  mutedTill?: Date;
  bannedTill?: Date;
}

export interface CreateUserOnChannelDto {}

export interface UpdateChannelDto {
  name?: string;
  type?: eChannelType;
  password?: string;
  ownerId?: number;
}
