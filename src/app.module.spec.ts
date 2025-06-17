import { Test, TestingModule } from "@nestjs/testing";
import { AppService } from "./app.service";
import { UtilsModule } from "./utils/utils.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_CONFIG, APP_CONFIG_SCHEMA } from "./config/app.config";
import { TypeOrmModule } from "@nestjs/typeorm";

describe.only('AppModule', () => {
  let configModule: ConfigModule;
  let typeOrmModule: TypeOrmModule;
  let authModule: AuthModule;
  let usersModule : UsersModule;
  let utilsModule: UtilsModule;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
          load: [APP_CONFIG],
          validationSchema: APP_CONFIG_SCHEMA,
        }),
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            return ({
              type            : 'postgres',
              host            : configService.get<string>('db.host'),
              port            : configService.get<number>('db.port'),
              username        : configService.get<string>('db.user'),
              password        : configService.get<string>('db.password'),
              database        : configService.get<string>('db.name'),
              autoLoadEntities: true,
              synchronize     : true,
            })
          },
        }),

        AuthModule,
        UsersModule, 
        UtilsModule
      ],
      providers: [AppService],
      exports: [UtilsModule],
    }).compile();

    // Modules
    configModule = moduleRef.get<ConfigModule>(ConfigModule);
    typeOrmModule = moduleRef.get<TypeOrmModule>(TypeOrmModule);
    authModule   = moduleRef.get<AuthModule>(AuthModule);
    usersModule  = moduleRef.get<UsersModule>(UsersModule);
    utilsModule  = moduleRef.get<UtilsModule>(UtilsModule);
  });

  it('AppModule should be defined', () => {
    expect(configModule).toBeDefined();
    expect(typeOrmModule).toBeDefined();
    expect(authModule).toBeDefined();
    expect(usersModule).toBeDefined();
    expect(utilsModule).toBeDefined();
  });
});