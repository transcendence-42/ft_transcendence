import { User } from 'src/user/entities/user.entity';

export class Rating {
  id: number;
  date: Date;
  rating: number;
  user?: User;
  userId: number;
}
