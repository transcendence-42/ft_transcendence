import { LocalRegisterUserDto } from '../dto/registerUser.dto';
import { User } from '@prisma/client';

export const mockValidRegisterUserDto: LocalRegisterUserDto = {
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
  hasActivated2fa: false,
  currentLadder: 1,
  currentStatus: 2,
};
