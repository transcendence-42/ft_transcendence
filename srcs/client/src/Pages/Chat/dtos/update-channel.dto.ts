import { eChannelType } from "../constants";

export class UpdateChannelDto {
  name?: string;
  type?: eChannelType;
  password?: string;
  ownerId?: number;
}
