import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompletedWorksService } from './completed-works.service';
import { CompletedWorksController } from './completed-works.controller';
import { CompletedWork } from './entities/completed-work.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompletedWork])],
  controllers: [CompletedWorksController],
  providers: [CompletedWorksService],
  exports: [CompletedWorksService],
})
export class CompletedWorksModule {}
