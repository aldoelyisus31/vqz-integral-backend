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

      // Validate access method exists
      const accessMethod = await this.accessMethodRepository.findOne({
        where: { id: createUserDto.accessMethodId },
      });

      if (!accessMethod) {
        throw new BadRequestException(`Access method with ID ${createUserDto.accessMethodId} not found`);
      }

      // Create user
      const user = this.usersRepository.create({
        username: createUserDto.username,
        email: createUserDto.email,
        fullName: createUserDto.fullName,
      });

      await queryRunner.manager.save(user);

      // Create user credentials
      const passwordHash = await this.bcryptService.hashPassword(createUserDto.password);
      const credentials = this.credentialsRepository.create({
        user,
        passwordHash,
        userTypeId: createUserDto.userTypeId,
        accessMethodId: createUserDto.accessMethodId,
      });

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
}