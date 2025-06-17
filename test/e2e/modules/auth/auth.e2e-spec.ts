import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../../../../src/app.module';
import { HttpExceptionFilter } from '../../../../src/common/filters/http-exception.filter';

const userMock = {
  username: 'user_auth_test',
  email: 'user_auth_test@email.com',
  password: 'user_auth_test',
  userTypeId: 1,
  accessMethodId: 1,
};

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Configure Swagger for testing
    const config = new DocumentBuilder()
      .setTitle('NestJS API')
      .setDescription('API Documentation')
      .setVersion('1.0')
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }));
    
    // Global exception filter
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
  });

  describe('/auth/register (POST)', () => {
    it('should not register a user if body was not given', async () => {
      const response = await request(app.getHttpServer()).post('/auth/register');
  
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('username must be longer than or equal to 3 characters, username should not be empty, username must be a string, email should not be empty, email must be an email, password must be longer than or equal to 8 characters, password should not be empty, password must be a string, userTypeId should not be empty, userTypeId must be a number conforming to the specified constraints, accessMethodId should not be empty, accessMethodId must be a number conforming to the specified constraints');
    });
  
    it('should register a new user with valid data', async () => {
      const response = await request(app.getHttpServer()).post('/auth/register').send(userMock);
  
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User registered successfully');
    });
  });

  describe('/auth/login (POST)', () => {
    it('Should not login with wrong credentials', async () => {
      const response = await request(app.getHttpServer()).post('/auth/login').send({
        username: userMock.username,
        password: 'wrongpassword',
      });
  
      expect(response.status).toBe(401);
    });
  
    it('Should login with good credentials and give access_token', async () => {
      const response = await request(app.getHttpServer()).post('/auth/login').send({
        username: userMock.username,
        password: userMock.password,
      });
  
      expect(response.status).toBe(201);
      expect(response.body.access_token).toBeDefined();
    });
  });

  describe('/auth/profile (get)', () => {
    it('Should not give the user profile if not authorized or bad bearer token', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer wrongtoken`);
  
      expect(response.status).toBe(401);
    });
  
    it('Should give the user profile if authorized or good bearer token', async () => {
      const { body } = await request(app.getHttpServer()).post('/auth/login').send({
        username: userMock.username,
        password: userMock.password,
      });
  
      const token = body.access_token;
      expect(token).toBeDefined();
  
      const response = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Profile accessed successfully');
    });
  });
  
  afterAll(async () => {
    await app.close();
  });
});
