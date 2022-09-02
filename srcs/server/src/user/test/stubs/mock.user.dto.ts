import { User } from '@prisma/client';
import { LocalRegisterUserDto } from 'src/auth/dto/registerUser.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

export const mockUserDto: CreateUserDto[] = [
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

export const mockUserUpdateDto: UpdateUserDto[] = [
  {
    username: 'updated',
    email: 'lisa@updated.com',
    currentStatus: 2,
    eloRating: 1250,
    stats: {
      update: {
        wins: 25,
        losses: 12,
      },
    },
  },
  { username: 'updated' },
  { email: 'marge@updated.com' },
  { currentStatus: 0 },
  { eloRating: 1250 },
  { stats: { update: { wins: 35 } } },
  { stats: { update: { losses: 8 } } },
  { stats: { update: { wins: 35, losses: 8 } } },
];

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
  currentStatus: 0,
  eloRating: 1000,
};
