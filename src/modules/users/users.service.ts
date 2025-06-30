import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { UserCredential } from './entities/user-credential.entity';
import { UserType } from './entities/user-type.entity';
import { AccessMethod } from './entities/access-method.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { BcryptService } from '../../utils/bcrypt/bcrypt.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly bcryptService: BcryptService,
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(UserCredential)
    private readonly credentialsRepository: Repository<UserCredential>,
    @InjectRepository(UserType)
    private readonly userTypeRepository: Repository<UserType>,
    @InjectRepository(AccessMethod)
    private readonly accessMethodRepository: Repository<AccessMethod>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Start a transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Check if user already exists
      const existingUser = await this.usersRepository.findOne({
        where: [
          { username: createUserDto.username },
          { email: createUserDto.email },
        ],
      });

      if (existingUser) {
        throw new ConflictException('Username or email already exists');
      }

      // Validate user type exists
      const userType = await this.userTypeRepository.findOne({
        where: { id: createUserDto.userTypeId },
      });

      if (!userType) {
        throw new BadRequestException(`User type with ID ${createUserDto.userTypeId} not found`);
      }

      // Get access method
      let accessMethod;
      if (createUserDto.accessMethodId) {
        accessMethod = await this.accessMethodRepository.findOne({
          where: { id: createUserDto.accessMethodId },
        });
      } else if (createUserDto.accessMethod) {
        accessMethod = await this.accessMethodRepository.findOne({
          where: { methodName: createUserDto.accessMethod },
        });
      } else {
        throw new BadRequestException('Either accessMethodId or accessMethod must be provided');
      }

      if (!accessMethod) {
        throw new BadRequestException('Access method not found');
      }

      // Create user
      const user = this.usersRepository.create({
        username: createUserDto.username,
        email: createUserDto.email,
        fullName: createUserDto.fullName,
        profileImage: createUserDto.profileImage,
      });

      await queryRunner.manager.save(user);

      // Create user credentials
      const credentials = this.credentialsRepository.create({
        user,
        userTypeId: createUserDto.userTypeId,
        accessMethodId: accessMethod.id,
      });

      // Only hash password for credentials method
      if (accessMethod.methodName === 'credentials') {
        if (!createUserDto.password) {
          throw new BadRequestException('Password is required for credentials method');
        }
        credentials.passwordHash = await this.bcryptService.hashPassword(createUserDto.password);
      }

      await queryRunner.manager.save(credentials);

      // Commit transaction
      await queryRunner.commitTransaction();
      delete user.credentials;
      return user;

    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['credentials'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { username },
      relations: ['credentials'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['credentials', 'credentials.accessMethod'],
    });

    return user;
  }

  async update(id: number, updateData: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, updateData);
    return this.findById(id);
  }

  async addAccessMethod(userId: number, methodName: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.findById(userId);
      const accessMethod = await this.accessMethodRepository.findOne({
        where: { methodName },
      });

      if (!accessMethod) {
        throw new BadRequestException(`Access method ${methodName} not found`);
      }

      // Get default user type (you might want to customize this)
      const userType = await this.userTypeRepository.findOne({
        where: { id: 1 }, // Assuming 1 is the default user type
      });

      if (!userType) {
        throw new BadRequestException('Default user type not found');
      }

      const credentials = this.credentialsRepository.create({
        userId: user.id,
        userTypeId: userType.id,
        accessMethodId: accessMethod.id,
      });

      await queryRunner.manager.save(credentials);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}