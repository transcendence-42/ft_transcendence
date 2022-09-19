export interface Message {
  content: string;
  date: number;
  id: string;
  channel: Channel;
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
  password?: string;
}
