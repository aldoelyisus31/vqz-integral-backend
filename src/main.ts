import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Servir archivos estáticos desde la carpeta uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Permitir CORS para el frontend de Vite
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('app.port');

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  app.setGlobalPrefix('api');

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('API Documentation for the NestJS application')
    .setVersion('1.0')
    .addTag('Authentication', 'Authentication related endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('User Types', 'User type management endpoints')
    .addTag('Banner', 'Banner image management endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(PORT);
  console.log(`🚀 App running in port ${PORT}`);
  console.log(`📚 Swagger documentation available at http://localhost:${PORT}/api/docs`);
}
bootstrap();
