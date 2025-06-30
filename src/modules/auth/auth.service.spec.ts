import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { AccessHistory } from '../users/entities/access-history.entity';
import { BcryptService } from '../../utils/bcrypt/bcrypt.service';
import { User } from '../users/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockAccessHistoryRepository = {
    save: jest.fn(),
  };

  const mockUsersService = {
    findByUsername: jest.fn(),
    findByEmail: jest.fn(),
    update: jest.fn(),
    addAccessMethod: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockBcryptService = {
    comparePassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: BcryptService,
          useValue: mockBcryptService,
        },
        {
          provide: getRepositoryToken(AccessHistory),
          useValue: mockAccessHistoryRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateOrCreateGoogleUser', () => {
    const mockGoogleUser = {
      email: 'test@example.com',
      fullName: 'Test User',
      username: 'testuser',
      profileImage: 'https://example.com/photo.jpg',
    };

    it('should update existing user with Google method', async () => {
      const mockExistingUser = {
        id: 1,
        email: 'test@example.com',
        profileImage: 'old-photo.jpg',
        credentials: [
          { accessMethod: { methodName: 'credentials' } },
        ],
      };

      mockUsersService.findByEmail.mockResolvedValue(mockExistingUser);
      mockUsersService.update.mockResolvedValue({
        ...mockExistingUser,
        profileImage: mockGoogleUser.profileImage,
      });

      const result = await service.validateOrCreateGoogleUser(mockGoogleUser);

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(mockGoogleUser.email);
      expect(mockUsersService.update).toHaveBeenCalledWith(mockExistingUser.id, {
        profileImage: mockGoogleUser.profileImage,
      });
      expect(mockUsersService.addAccessMethod).toHaveBeenCalledWith(mockExistingUser.id, 'google');
      expect(result).toBeDefined();
    });

    it('should create new user with Google method', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue({
        id: 1,
        ...mockGoogleUser,
      });

      const result = await service.validateOrCreateGoogleUser(mockGoogleUser);

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(mockGoogleUser.email);
      expect(mockUsersService.create).toHaveBeenCalledWith({
        ...mockGoogleUser,
        accessMethod: 'google',
        userTypeId: 1,
      });
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
    });
  });

  describe('loginWithGoogle', () => {
    it('should create access history and return JWT token', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        credentials: [
          { accessMethod: { methodName: 'google', id: 2 } },
        ],
        email: 'email@gmail.com'
      } as User;

      const mockToken = 'jwt-token';
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.loginWithGoogle(mockUser);

      console.log('result', mockUser.credentials[0].accessMethod.id);

      expect(mockAccessHistoryRepository.save).toHaveBeenCalledWith({
        userId: mockUser.id,
        accessMethodId: mockUser.credentials[0].accessMethod.id,
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        username: mockUser.username,
        sub: mockUser.id,
      });
      expect(result).toEqual({ access_token: mockToken });
    });
  });
});