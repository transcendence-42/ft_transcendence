import { LocalRegisterUserDto, LocalLoginUserDto } from '../dto';
import { User } from '@prisma/client';

const password = 'jfs+-lkjfas/d8Bkjdf*';
const username = 'nammari';
const username2 = 'noufel';
const email = 'nammari@student.42.fr';
const email2 = 'noufel@student.42.fr';
const fakeEmail = 'noumari@lol.com';

export const mockRegisterUserInfo: LocalRegisterUserDto = {
  username: username,
  email: email,
  password: password,
};

export const mockRegisterUserInfoDiffEmail: LocalRegisterUserDto = {
  username: username,
  email: email2,
  password: password,
};

export const mockRegisterUserInfoDiffUsername: LocalRegisterUserDto = {
  username: username2,
  email: email,
  password: password,
};

export const mockLoginUserInfo: LocalLoginUserDto = {
  email: email,
  password: password,
};

export const invalidEmailLoginUserInfo: LocalLoginUserDto = {
  email: fakeEmail,
  password: password,
};

export const invalidPwdLoginUserInfo: LocalLoginUserDto = {
  email: email,
  password: password + '42',
};

export const fakeUser: User = {
  id: null,
  email: email,
  username: username,
  profilePicture: null,
  createdAt: null,
  currentStatus: 0,
  currentLadder: 0,
};
