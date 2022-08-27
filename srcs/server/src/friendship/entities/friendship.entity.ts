import { User } from 'src/user/entities/user.entity';

export class Friendship {
  requester?: User;
  requesterId: number;
  addressee?: User;
  addresseeId: number;
  date: Date;
  status: number;
}
