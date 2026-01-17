import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppLoggerService } from '@shared/utils/logger.service';

process.env.SERVICE_NAME = process.env.SERVICE_NAME || 'user-service';

async function bootstrap() {
  const logger = AppLoggerService.create('Bootstrap');
  
  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log'],
    });

    app.useLogger(app.get(AppLoggerService));

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        disableErrorMessages: process.env.NODE_ENV === 'production',
      })
    );

    const port = process.env.PORT || 3006;
    await app.listen(port);
    
    logger.log(`User Service is running on port ${port}`, 'Bootstrap', {
      environment: process.env.NODE_ENV || 'development',
      port,
    });
  } catch (error) {
    logger.error(
      'Failed to start User Service',
      error instanceof Error ? error.stack : String(error),
      'Bootstrap'
    );
    process.exit(1);
  }
}

bootstrap();
