import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/login.dto';
import { LocalRegisterUserDto } from './dto/registerUser.dto';

describe('AuthService integration', () => {
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
      const userInfo: LocalRegisterUserDto = {
        email: 'noufel@ammari.com',
        username: 'nammari',
        password: 'mypass2L8*dsjl',
      };
      const user = await authService.localRegisterUser(userInfo);
      expect(user.email).toBe(userInfo.email);
      expect(user.username).toBe(userInfo.username);
      expect(user.created_at).toBeDefined();
      expect(user.id).toBeDefined();
    });
    it('Should throw an error when trying to create a user that already exists ', async () => {
      const userInfo: LocalRegisterUserDto = {
        email: 'noufel@ammari.com',
        username: 'nammari',
        password: 'mypass2L8*dsjl',
      };
      const user = await authService
        .localRegisterUser(userInfo)
        .catch((error) => expect(error.status).toBe(401));
    });
  });
  describe('validateUserCredentials() -> Checks if the user trying to login has the correct credentials', () => {
    const createUser: LocalRegisterUserDto = {
      email: 'noufel@ammari.com',
      username: 'nammari',
      password: 'mypass2L8*dsjl',
    };
    const validUserInfo: UserLoginDto = {
      email: 'noufel@ammari.com',
      password: 'mypass2L8*dsjl',
    };
    const invalidEmailUserInfo: UserLoginDto = {
      email: 'znoufel@ammari.com',
      password: 'mypass2L8*dsjl',
    };
    const invalidPwdUserInfo: UserLoginDto = {
      email: 'noufel@ammari.com',
      password: 'zzzzmypass2L8*dsjl',
    };
    it('Valid User: Should say that the credentials are valid', async () => {
      const createdUser = await authService.localRegisterUser(createUser);
      const user = await authService.validateUserCredentials(validUserInfo);
      expect(user).toBeDefined();
      expect(user.email).toBe(validUserInfo.email);
    });
    it('Invalid User email: Should say that the email is invalid', async () => {
      const createdUser = await authService.localRegisterUser(createUser);
      const user = await authService
        .validateUserCredentials(invalidEmailUserInfo)
        .catch((error) => {
          expect(error.message).toBe('Invalid email!');
          expect(error.status).toBe(401);
        });
    });
    it('Invalid User password: Should say that the password is invalid', async () => {
      const createdUser = await authService.localRegisterUser(createUser);
      const user = await authService
        .validateUserCredentials(invalidPwdUserInfo)
        .catch((error) => {
          expect(error.message).toBe('Invalid password!');
          expect(error.status).toBe(401);
        });
    });
  });
});
