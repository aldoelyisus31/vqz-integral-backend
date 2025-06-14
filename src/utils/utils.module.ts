import { Module } from '@nestjs/common';
import { BcryptService } from './bcrypt/bcrypt.service';

@Module({
  imports: [],
  providers: [
    BcryptService
  ],
  exports: [
    BcryptService
  ]
})
export class UtilsModule {}
