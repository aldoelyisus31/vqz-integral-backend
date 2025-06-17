import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        userTypeId: 1,
        accessMethodId: 1,
      };

      const mockUser: User = {
        id: 1,
        email: createUserDto.email,
        username: createUserDto.username,
      };

      const spy = jest.spyOn(usersService, 'create').mockResolvedValue(mockUser);

      const result = await controller.register(createUserDto);

      expect(spy).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual({
        message: 'User registered successfully',
        userId: 1,
      });
    });

    it('should throw error if registration fails', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        userTypeId: 1,
        accessMethodId: 1,
      };

      jest.spyOn(usersService, 'create').mockRejectedValue(new Error('Registration failed'));

      await expect(controller.register(createUserDto)).rejects.toThrow('Registration failed');
    });

    /* it('should throw error if username or email already exists', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        userTypeId: 1,
        accessMethodId: 1,
      };

      jest.spyOn(usersService, 'create').mockRejectedValue(new Error('Username or email already exists'));
      await expect(controller.register(createUserDto)).rejects.toThrow('Username or email already exists');
    }); */
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'password123',
      };

      const mockResponse = {
        access_token: 'mock-jwt-token',
      };

      jest.spyOn(authService, 'login').mockResolvedValue(mockResponse);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(mockResponse);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'wrongpassword',
      };

      jest.spyOn(authService, 'login').mockRejectedValue(new UnauthorizedException());

      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getProfile', () => {
    it('should return profile access message', () => {
      const result = controller.getProfile();
      expect(result).toEqual({ message: 'Profile accessed successfully' });
    });
  });
});