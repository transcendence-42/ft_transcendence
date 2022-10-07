import { eChannelType } from "../constants";

export interface CreateChannelDto {
  name: string;
  type: eChannelType;
  ownerId: number;
  password?: string;
}