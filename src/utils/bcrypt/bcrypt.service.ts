import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hash, compare } from 'bcrypt';
import { config } from 'dotenv';

@Injectable()
export class BcryptService {
  private readonly SALT_ROUNDS: number;
  constructor(private readonly configService: ConfigService) {
    this.SALT_ROUNDS = configService.get<number>('bcrypt.saltRounds');
  }

  async hashPassword (password: string): Promise<string> {
    return await hash(password, this.SALT_ROUNDS);
  }

  async comparePassword (password: string, hash: string): Promise<boolean> {
    return await compare(password, hash);
  }

  getSaltRounds(): number {
    return this.SALT_ROUNDS;
  }
}
