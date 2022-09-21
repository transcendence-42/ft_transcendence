export interface Message {
  content: string;
  fromUserId :string;
  toChannelId: Channel;
}

export interface Channel {
  id: string;
  name: string;
  type: string;
  password?: string;
  userIdList: string[];
}

export interface JoinChannelDto {
  id: string;
  name: string;
  type: string;
  userId: string;
  password?: string;
}

export interface ChatUser {
  socketId: string;
  id: string;
  name: string;
  channels?: string[];
  directMessges?: string[];
}

export interface ChannelUserDto {
    id: string;
    role: string;
}