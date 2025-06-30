import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { CreateUserDto } from '../../../src/modules/users/dto/create-user.dto';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let createdUserId: number;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /users', () => {
    const validUserData: CreateUserDto = {
      username: 'testuser_user_module',
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test User',
      userTypeId: 1,
      accessMethodId: 1
    };

    it('should create a new user with valid data', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send(validUserData)
        .expect(HttpStatus.CREATED)
        .expect(res => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.username).toBe(validUserData.username);
          expect(res.body.email).toBe(validUserData.email);
          expect(res.body).not.toHaveProperty('password');
          createdUserId = res.body.id;
        });
    });

    it('should fail to create user with duplicate username', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send(validUserData)
        .expect(HttpStatus.CONFLICT);
    });

    it('should fail to create user with duplicate email', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          ...validUserData,
          username: 'differentuser'
        })
        .expect(HttpStatus.CONFLICT);
    });

    it('should fail with invalid email format', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          ...validUserData,
          email: 'invalid-email',
          username: 'newuser1'
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should fail with short password', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          ...validUserData,
          password: '123',
          username: 'newuser2',
          email: 'newuser2@example.com'
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should fail with short username', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          ...validUserData,
          username: 'ab',
          email: 'newuser3@example.com'
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should fail with missing required fields', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          username: 'testuser4'
        })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('GET /users/:id', () => {
    it('should get user by valid ID', () => {
      return request(app.getHttpServer())
        .get(`/users/${createdUserId}`)
        .expect(HttpStatus.OK)
        .expect(res => {
          expect(res.body.id).toBe(createdUserId);
          expect(res.body.username).toBeDefined();
          expect(res.body.email).toBeDefined();
          expect(res.body.credentials).toBeUndefined();
        });
    });

    it('should fail with non-existent ID', () => {
      return request(app.getHttpServer())
        .get('/users/99999')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should fail with invalid ID format', () => {
      return request(app.getHttpServer())
        .get('/users/invalid-id')
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('GET /users/username/:username', () => {
    it('should get user by valid username', () => {
      return request(app.getHttpServer())
        .get('/users/username/testuser_user_module')
        .expect(HttpStatus.OK)
        .expect(res => {
          expect(res.body.username).toBe('testuser_user_module');
          expect(res.body.email).toBeDefined();
          expect(res.body.credentials).toBeUndefined();
        });
    });

    it('should fail with non-existent username', () => {
      return request(app.getHttpServer())
        .get('/users/username/nonexistentuser')
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});