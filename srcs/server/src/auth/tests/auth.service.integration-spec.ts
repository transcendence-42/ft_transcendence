import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserAlreadyExistsException } from 'src/user/exceptions/user-exceptions';
import { AuthService } from '../auth.service';
import { LocalLoginUserDto, LocalRegisterUserDto } from '../dto';
import { BadCredentialsException } from '../exceptions';
import {
  invalidEmailLoginUserInfo,
  invalidPwdLoginUserInfo,
  mockLoginUserInfo,
  mockRegisterUserInfo,
  mockRegisterUserInfoDiffEmail,
  mockRegisterUserInfoDiffUsername,
} from './mock.user.dto';

describe('AuthService integration test', () => {
  let prisma: PrismaService;
  let authService: AuthService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    prisma = moduleRef.get(PrismaService);
    authService = moduleRef.get(AuthService);
  });
  beforeEach(async () => {
    await prisma.cleanDatabase();
  });
  describe('localRegisterUser() -> Create User using email and password', () => {
    it('it should create a user using an email, password and username', async () => {
      const user = await authService.localRegisterUser(mockRegisterUserInfo);
      expect(user.email).toBe(mockRegisterUserInfo.email);
      expect(user.username).toBe(mockRegisterUserInfo.username);
      expect(user.createdAt).toBeDefined();
      expect(user.id).toBeDefined();
    });
    it('Should throw an error when trying to create a user that already exists ', async () => {
      const user = await authService.localRegisterUser(mockRegisterUserInfo);
      await authService
        .localRegisterUser(mockRegisterUserInfo)
        .catch((error) =>
          expect(error.message).toBe(
            `User \"${mockRegisterUserInfo.email}\" already exists`,
          ),
        );
    });
  });
  describe('validateLocalUser() -> Checks if the user trying to login has the correct credentials', () => {
    it('Valid User: Should say that the credentials are valid', async () => {
      const createdUser = await authService.localRegisterUser(
        mockRegisterUserInfo,
      );
      const user = await authService.validateLocalUser(mockLoginUserInfo);
      expect(user).toBeDefined();
      expect(user.email).toBe(mockLoginUserInfo.email);
      expect(user.authentication).toBe('Logged-in');
    });
    it('Invalid User email: Should say that the email is invalid', async () => {
      const createdUser = await authService.localRegisterUser(
        mockRegisterUserInfo,
      );
      const user = await authService
        .validateLocalUser(invalidEmailLoginUserInfo)
        .catch((error) => {
          expect(error.message).toBe('Invalid email!');
        });
    });
    it('Invalid User password: Should say that the password is invalid', async () => {
      const createdUser = await authService.localRegisterUser(
        mockRegisterUserInfo,
      );
      const user = await authService
        .validateLocalUser(invalidPwdLoginUserInfo)
        .catch((error) => {
          expect(error.message).toBe('Invalid password!');
        });
    });
  });
});
