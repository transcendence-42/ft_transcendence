import { User } from 'src/user/entities/user.entity';

export class AuthResponse {
  readonly message: string;
}

export class AuthSuccessResponse {
  readonly message: string;
  readonly user: User;
}
