import { MessageDto } from "../dtos/message.dto";

export interface Message extends MessageDto {
  id: string;
  sentDate: number;
}