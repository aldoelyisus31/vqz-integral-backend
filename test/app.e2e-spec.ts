import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

describe('AppController (e2e)', () => {
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
    
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/api (GET) - should serve Swagger documentation', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect('Content-Type', /html/);
  });

  it('/api-json (GET) - should serve Swagger JSON', () => {
    return request(app.getHttpServer())
      .get('/api-json')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        expect(res.body.info.title).toBe('NestJS API');
        expect(res.body.info.version).toBe('1.0');
      });
  });
});
