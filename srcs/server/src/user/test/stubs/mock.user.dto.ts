import { LocalRegisterUserDto } from 'src/auth/dto/registerUser.dto';
import { User } from '@prisma/client';
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
  currentStatus: 1,
  currentLadder: 17,
};

export const fakeUser: User = {
  id: null,
  email: mockValidRegisterUserDto.email,
  username: mockValidRegisterUserDto.username,
  profilePicture: null,
  createdAt: null,
  currentStatus: 0,
  currentLadder: 0,
};
