import { LocalRegisterUserDto } from 'src/auth/dto/registerUser.dto';
import { User } from '@prisma/client';

export const mockValidRegisterUserDto: LocalRegisterUserDto = {
  username: 'nammari',
  email: 'nammari@student.42.fr',
  password: 'jfs+-lkjfas/d8Bkjdf*',
};

export const mockUserDto: LocalRegisterUserDto = {
  username: 'nammari',
  email: 'nammari@student.42.fr',
  password: 'jfs+-lkjfas/d8Bkjdf*',
};

export const fakeUser: User = {
  id: null,
  email: mockValidRegisterUserDto.email,
  username: mockValidRegisterUserDto.username,
  profilePicture: null,
  createdAt: null,
  currentStatus: 0,
  currentLadder: 0,
  hasActivated2fa: false,
};
