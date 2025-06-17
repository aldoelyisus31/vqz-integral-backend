import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';

const mockUsers: User[] = [
  {
    id: 1,
    username: 'testuser',
    email: 'testuser@mail.com',
    fullName: 'Test User'
  },
  {
    id: 2,
    username: 'testuser2',
    email: 'testuser2@mail.com',
    fullName: 'Test User 2'
  },
]

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findByUsername: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test User',
      userTypeId: 1,
      accessMethodId: 1,
    };

    it('should create a user successfully', async () => {
      const mockUser = {
        id: 1,
        username: createUserDto.username,
        email: createUserDto.email,
        fullName: createUserDto.fullName,
      } as User;

      const spy = jest.spyOn(service, 'create').mockResolvedValue(mockUser);

      const result = await controller.create(createUserDto);

      expect(spy).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException when username/email exists', async () => {
      jest.spyOn(service, 'create').mockRejectedValue(new ConflictException());

      await expect(controller.create(createUserDto)).rejects.toThrow(ConflictException);
    });

    it('should propagate other errors', async () => {
      const error = new Error('Unknown error');
      jest.spyOn(service, 'create').mockRejectedValue(error);
      
      await expect(controller.create(createUserDto)).rejects.toThrow(error);
    });
  });

  describe('findById', () => {
    const userId = '1';

    it('should return a user when found', async () => {

      const spy = jest.spyOn(service, 'findById').mockResolvedValue(mockUsers[0]);

      const result = await controller.findById(+userId);

      expect(spy).toHaveBeenCalledWith(+userId);
      expect(result).toEqual(mockUsers[0]);
    });

    it('should throw NotFoundException when user not found', async () => {
      jest.spyOn(service, 'findById').mockRejectedValue(new NotFoundException());

      await expect(controller.findById(+userId)).rejects.toThrow(NotFoundException);
    });

    it('should propagate other errors', async () => {
      const error = new Error('Unknown error');
      jest.spyOn(service, 'findById').mockRejectedValue(error);

      await expect(controller.findById(+userId)).rejects.toThrow(error);
    });
  });

  describe('findByUsername', () => {
    const username = 'testuser';

    it('should return a user when found', async () => {
      const mockUser = {
        id: 1,
        username: username,
        email: 'test@example.com',
        fullName: 'Test User',
      } as User;

      const spy = jest.spyOn(service, 'findByUsername').mockResolvedValue(mockUser);

      const result = await controller.findByUsername(username);

      expect(spy).toHaveBeenCalledWith(username);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      jest.spyOn(service, 'findByUsername').mockRejectedValue(new NotFoundException());

      await expect(controller.findByUsername(username)).rejects.toThrow(NotFoundException);
    });

    it('should propagate other errors', async () => {
      const error = new Error('Unknown error');
      jest.spyOn(service, 'findByUsername').mockRejectedValue(error);

      await expect(controller.findByUsername(username)).rejects.toThrow(error);
    });
  });
});