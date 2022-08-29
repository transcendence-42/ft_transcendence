import { LocalRegisterUserDto } from 'src/auth/dto/registerUser.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

export const mockValidRegisterUserDto: LocalRegisterUserDto = {
  username: 'nammari',
  email: 'nammari@student.42.fr',
  password: 'jfs+-lkjfas/d8Bkjdf*',
};

export const mockUserDto: CreateUserDto = {
  username: 'homer',
  email: 'homer@springfield.com',
  profilePicture: 'http://site.com/image.png',
};
