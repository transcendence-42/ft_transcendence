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
  profile_picture: null,
  created_at: null,
  two_fa_secret: '7987',
  two_fa_activated: false,
};
