import { Channel } from './channel.entity';

export class Message {
  content: string;
  date: number;
  id: string;
  channel: Channel;
}
