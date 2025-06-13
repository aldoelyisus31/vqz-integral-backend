import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { AccessHistory } from '../users/entities/access-history.entity';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let accessHistoryRepository: Repository<AccessHistory>;

  const mockUsersService = {
    findByUsername: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockAccessHistoryRepository = {
    save: jest.fn(),
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
          provide: getRepositoryToken(AccessHistory),
          useValue: mockAccessHistoryRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    accessHistoryRepository = module.get<Repository<AccessHistory>>(
      getRepositoryToken(AccessHistory),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should throw UnauthorizedException when user not found', async () => {
      mockUsersService.findByUsername.mockResolvedValue(null);

      await expect(
        service.validateUser('testuser', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        credentials: [
          {
            passwordHash: await bcrypt.hash('rightpassword', 10),
          },
        ],
      };

      mockUsersService.findByUsername.mockResolvedValue(mockUser);

      await expect(
        service.validateUser('testuser', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return user when credentials are valid', async () => {
      const password = 'correctpassword';
      const passwordHash = await bcrypt.hash(password, 10);
      const mockUser = {
        id: 1,
        username: 'testuser',
        credentials: [
          {
            passwordHash,
          },
        ],
      };

      mockUsersService.findByUsername.mockResolvedValue(mockUser);

      const result = await service.validateUser('testuser', password);
      expect(result).toEqual(mockUser);
    });
  });

  describe('login', () => {
    it('should create access history and return JWT token', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        credentials: [
          {
            accessMethodId: 1,
            passwordHash: await bcrypt.hash('password', 10),
          },
        ],
      };

      const mockToken = 'jwt-token';
      mockUsersService.findByUsername.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue(mockToken);
      mockAccessHistoryRepository.save.mockResolvedValue({});

      const result = await service.login({
        username: 'testuser',
        password: 'password',
      });

      expect(result).toEqual({ access_token: mockToken });
      expect(mockAccessHistoryRepository.save).toHaveBeenCalledWith({
        userId: mockUser.id,
        accessMethodId: mockUser.credentials[0].accessMethodId,
      });
    });
  });
});