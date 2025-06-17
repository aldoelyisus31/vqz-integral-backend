import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BcryptService } from './bcrypt.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('BcryptService', () => {
  let service: BcryptService;
  let configService: ConfigService;

  const MOCK_SALT_ROUNDS = 10;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BcryptService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(MOCK_SALT_ROUNDS),
          },
        },
      ],
    }).compile();

    service = module.get<BcryptService>(BcryptService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(configService).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('constructor', () => {
    it('should get salt rounds from config', () => {
      expect(configService.get).toHaveBeenCalledWith('bcrypt.saltRounds');
      expect(service.getSaltRounds()).toBe(MOCK_SALT_ROUNDS);
    });
  });

  describe('hashPassword', () => {
    it('should hash password successfully', async () => {
      const password = 'testPassword';
      const hashedPassword = 'hashedPassword';
      
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await service.hashPassword(password);

      expect(result).toBe(hashedPassword);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, MOCK_SALT_ROUNDS);
    });

    it('should propagate hash errors', async () => {
      const password = 'testPassword';
      const error = new Error('Hash error');
      
      (bcrypt.hash as jest.Mock).mockRejectedValue(error);

      await expect(service.hashPassword(password)).rejects.toThrow(error);
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching password', async () => {
      const password = 'testPassword';
      const hash = 'hashedPassword';
      
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.comparePassword(password, hash);

      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
    });

    it('should return false for non-matching password', async () => {
      const password = 'wrongPassword';
      const hash = 'hashedPassword';
      
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.comparePassword(password, hash);

      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
    });

    it('should propagate compare errors', async () => {
      const password = 'testPassword';
      const hash = 'hashedPassword';
      const error = new Error('Compare error');
      
      (bcrypt.compare as jest.Mock).mockRejectedValue(error);

      await expect(service.comparePassword(password, hash)).rejects.toThrow(error);
    });
  });

  describe('getSaltRounds', () => {
    it('should return configured salt rounds', () => {
      expect(service.getSaltRounds()).toBe(MOCK_SALT_ROUNDS);
    });
  });
});