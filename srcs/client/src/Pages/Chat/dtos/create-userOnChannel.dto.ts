import { eUserRole } from "../constants";

export class CreateUserOnChannelDto {
  role: eUserRole;
  userId: number;
  channelId: number;
}
