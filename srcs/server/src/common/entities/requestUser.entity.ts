export class RequestUser {
  id: number;
  username: string;
  email: string;
  isTwoFactorAuthenticated: boolean;
  isTwoFactorActivated: boolean;
  authentication?: string;
}
