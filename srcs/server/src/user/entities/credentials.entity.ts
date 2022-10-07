import { User } from './user.entity';

export class Credentials {
  id: number;
  email: string;
  username: string;
  password: string | null;
  user?: User;
  userId: number;
  isTwoFactorActivated: boolean;
  isTwoFactorSecret: string | null;
}
