import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserCredential } from './entities/user-credential.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(UserCredential)
    private readonly credentialsRepository: Repository<UserCredential>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
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

    // Create user
    const user = this.usersRepository.create({
      username: createUserDto.username,
      email: createUserDto.email,
      fullName: createUserDto.fullName,
    });

    await this.usersRepository.save(user);

    // Create user credentials
    const passwordHash = await bcrypt.hash(createUserDto.password, 10);
    const credentials = this.credentialsRepository.create({
      userId: user.id,
      passwordHash,
      userTypeId: 1, // Default user type
      accessMethodId: 1, // Password authentication method
    });

    await this.credentialsRepository.save(credentials);

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