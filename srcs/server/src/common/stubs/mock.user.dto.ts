import { LocalRegisterUserDto } from 'src/auth/dto/registerUser.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

const userData = [
  { username: 'homer', email: 'homer@springfield.com' },
  { username: 'marge', email: 'marge@springfield.com' },
  { username: 'bart', email: 'bart@springfield.com' },
  { username: 'lisa', email: 'lisa@springfield.com' },
  { username: 'maggie', email: 'maggie@springfield.com' },
  { username: 'moe', email: 'moe@springfield.com' },
  { username: 'burns', email: 'burns@springfield.com' },
  { username: 'smithers', email: 'smithers@springfield.com' },
  { username: 'flanders', email: 'flanders@springfield.com' },
];

export const mockValidRegisterUserDto: LocalRegisterUserDto = {
  username: 'nammari',
  email: 'nammari@student.42.fr',
  password: 'jfs+-lkjfas/d8Bkjdf*',
};

let mockUserDto: CreateUserDto[];
userData.forEach((user, i) => {
  mockUserDto[i] = { username: user.username, email: user.email };
});

export { mockUserDto };
