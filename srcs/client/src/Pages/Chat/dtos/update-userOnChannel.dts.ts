import { eUserRole } from "../constants";
export class UpdateUserOnChannelDto {
  role?: eUserRole;
  isMuted?: boolean;
  isBanned?: boolean;
  hasLeftTheChannel?: boolean;
}