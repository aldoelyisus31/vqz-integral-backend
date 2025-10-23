import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { APP_CONFIG, APP_CONFIG_SCHEMA } from './config/app.config';
import { UtilsModule } from './utils/utils.module';
import { UserTypeModule } from './modules/user-type/user-type.module';
import { ActionLogsModule } from './modules/action-logs/action-logs.module';
import { ActionLogInterceptor } from './modules/action-logs/interceptors/action-log.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      load: [APP_CONFIG],
      validationSchema: APP_CONFIG_SCHEMA,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return ({
          type: 'postgres',
          host: configService.get<string>('db.host'),
          port: configService.get<number>('db.port'),
          username: configService.get<string>('db.user'),
          password: configService.get<string>('db.password'),
          database: configService.get<string>('db.name'),
          autoLoadEntities: true,
          synchronize: configService.get<string>('node_env') !== 'PRODUCTION',
        })
      },
    }),
    AuthModule,
    UsersModule,
    UtilsModule,
    UserTypeModule,
    ActionLogsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ActionLogInterceptor,
    },
  ],
  exports: [UtilsModule],
})
export class AppModule {}
