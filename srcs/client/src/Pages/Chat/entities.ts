export interface Message {
  message: string;
  date: number;
  id: string;
}

export interface Channel {
  id: string;
  name: string;
}
export interface Payload {
  message: Message;
  channel: Channel;
}
