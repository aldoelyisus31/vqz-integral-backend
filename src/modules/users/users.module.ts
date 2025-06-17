import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { UserCredential } from './entities/user-credential.entity';
import { UserType } from './entities/user-type.entity';
import { AccessMethod } from './entities/access-method.entity';
import { AccessHistory } from './entities/access-history.entity';
import { UtilsModule } from '../../utils/utils.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserCredential,
      UserType,
      AccessMethod,
      AccessHistory,
    ]),
    UtilsModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}