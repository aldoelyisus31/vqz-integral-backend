import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserCredential } from './entities/user-credential.entity';
import { UserType } from './entities/user-type.entity';
import { AccessMethod } from './entities/access-method.entity';
import { AccessHistory } from './entities/access-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserCredential,
      UserType,
      AccessMethod,
      AccessHistory,
    ]),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}