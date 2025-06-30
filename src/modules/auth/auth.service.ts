import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { AccessHistory } from '../users/entities/access-history.entity';
import { BcryptService } from '../../utils/bcrypt/bcrypt.service';
import { User } from '../users/entities/user.entity';

interface GoogleUser {
  email: string;
  fullName: string;
  username: string;
  profileImage: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly bcryptService: BcryptService,
    @InjectRepository(AccessHistory)
    private readonly accessHistoryRepository: Repository<AccessHistory>,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);

    if (!user || !user.credentials[0]) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.bcryptService.comparePassword(
      password,
      user.credentials[0].passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async validateOrCreateGoogleUser(googleUser: GoogleUser): Promise<User> {
    let user = await this.usersService.findByEmail(googleUser.email);

    if (user) {
      // Update user's profile image if it exists
      if (googleUser.profileImage && user.profileImage !== googleUser.profileImage) {
        user = await this.usersService.update(user.id, {
          profileImage: googleUser.profileImage,
        });
      }

      // Check if user already has Google OAuth method
      const hasGoogleMethod = user.credentials.some(
        (cred) => cred.accessMethod.methodName === 'google',
      );

      if (!hasGoogleMethod) {
        // Add Google OAuth method to existing user
        await this.usersService.addAccessMethod(user.id, 'google');
      }
    } else {
      // Create new user with Google OAuth
      user = await this.usersService.create({
        email: googleUser.email,
        username: googleUser.username,
        fullName: googleUser.fullName,
        profileImage: googleUser.profileImage,
        accessMethod: 'google',
        userTypeId: 1,
      });
    }

    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);

    // Create access history record
    await this.accessHistoryRepository.save({
      userId: user.id,
      accessMethodId: user.credentials[0].accessMethodId,
    });

    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async loginWithGoogle(user: User) {
    // Create access history record
    const googleMethod = user.credentials.find(
      (cred) => cred.accessMethod.methodName === 'google',
    );

    console.log('googleMethod', googleMethod);
    
    await this.accessHistoryRepository.save({
      userId: user.id,
      accessMethodId: googleMethod.accessMethod.id,
    });

    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}