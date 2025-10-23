import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionLogsService } from './action-logs.service';
import { ActionLog } from './entities/action-log.entity';
import { ActionLogInterceptor } from './interceptors/action-log.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([ActionLog])],
  providers: [ActionLogsService, ActionLogInterceptor],
  exports: [ActionLogsService, ActionLogInterceptor],
})
export class ActionLogsModule {}
