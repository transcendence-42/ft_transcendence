export interface MessageDto {
  content: string;
  fromUserId: number;
  toChannelOrUserId: number;
}